import getBrowserSupabaseClient from '../supabase/browser-client'

const supabase = getBrowserSupabaseClient()

export async function signUp(email: string, password: string) {
  const res = await supabase.auth.signUp({ email, password })
  if (res.error) return { error: res.error }
  // Do not expose tokens here; email verification may be required.
  return { user: res.data.user }
}

export async function signIn(email: string, password: string) {
  const res = await supabase.auth.signInWithPassword({ email, password })
  if (res.error) return { error: res.error }

  const session = res.data.session
  if (!session) return { error: new Error('no session returned') }

  const accessToken = session.access_token

  // compute maxAge in seconds if expires_at present
  let maxAge: number | undefined
  if (typeof session.expires_at === 'number') {
    const now = Math.floor(Date.now() / 1000)
    const remaining = session.expires_at - now
    if (remaining > 0) maxAge = remaining
  }

  // Send access token to server to set HttpOnly cookie. Do not log the token.
  try {
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken, maxAge }),
    })
  } catch (err) {
    // don't include tokens in errors
    return { error: new Error('failed to sync session with server') }
  }

  return { user: session.user }
}

export async function signOut() {
  // Sign out from Supabase client
  const res = await supabase.auth.signOut()

  // Clear server cookie
  try {
    await fetch('/api/auth/session', { method: 'DELETE' })
  } catch (err) {
    // ignore
  }

  return res
}

export async function resetPassword(email: string) {
  // Supabase v2 provides resetPasswordForEmail
  const res = await supabase.auth.resetPasswordForEmail(email)
  return res
}

export async function confirmPasswordReset(accessToken: string | null, newPassword: string) {
  if (!accessToken) return { error: new Error('access token missing') }

  try {
    // set session using the access token so updateUser can run
    // setSession may accept only access_token; ignore return
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await supabase.auth.setSession({ access_token: accessToken })

    const res = await supabase.auth.updateUser({ password: newPassword })
    if (res.error) return { error: res.error }

    // sync server cookie
    try {
      const access = res.data?.access_token ?? accessToken
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: access }),
      })
    } catch (err) {
      // ignore
    }

    return { ok: true }
  } catch (err: any) {
    return { error: err }
  }
}

// Keep server cookie in sync when Supabase refreshes tokens
export function watchAuthChanges() {
  const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
    try {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const accessToken = session?.access_token
        if (accessToken) {
          // compute maxAge if possible
          let maxAge: number | undefined
          if (session.expires_at) {
            const now = Math.floor(Date.now() / 1000)
            const remaining = session.expires_at - now
            if (remaining > 0) maxAge = remaining
          }

          await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken, maxAge }),
          })
        }
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        await fetch('/api/auth/session', { method: 'DELETE' })
      }
    } catch (err) {
      // swallow errors to avoid leaking tokens
    }
  })

  return () => sub.unsubscribe()
}

export async function initAuth() {
  try {
    const { data } = await supabase.auth.getSession()
    const session = data?.session
    if (session?.access_token) {
      const accessToken = session.access_token
      let maxAge: number | undefined
      if (typeof session.expires_at === 'number') {
        const now = Math.floor(Date.now() / 1000)
        const remaining = session.expires_at - now
        if (remaining > 0) maxAge = remaining
      }

      // Sync existing client session to server cookie
      try {
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken, maxAge }),
        })
      } catch (err) {
        // ignore
      }
    }
  } catch (err) {
    // ignore
  }
}

export default {
  signUp,
  signIn,
  signOut,
  resetPassword,
  watchAuthChanges,
  initAuth,
}
