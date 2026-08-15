import { createFileRoute } from '@tanstack/react-router'

import { parseCookies, buildSetCookie, buildClearCookie, parseJwtPayload } from '../../../lib/auth/cookies'

export const Route = createFileRoute('/api/auth/session')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const cookieHeader = request.headers.get('cookie')
        const cookies = parseCookies(cookieHeader)
        const token = cookies['__Host-sb-session']

        if (!token) {
          return new Response(JSON.stringify({ authenticated: false }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
        if (!url) {
          return new Response(JSON.stringify({ authenticated: false }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        try {
          const userRes = await fetch(`${url.replace(/\/$/, '')}/auth/v1/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (!userRes.ok) {
            return new Response(JSON.stringify({ authenticated: false }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const user = await userRes.json()

          const data: Record<string, any> = { authenticated: true }
          if (user?.id) data.userId = user.id
          if (user?.email) data.email = user.email

          // provide expiry if token contains it (parsed client-side)
          const payload = parseJwtPayload(token)
          if (payload?.exp) data.expiresAt = Number(payload.exp)

          return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (err) {
          return new Response(JSON.stringify({ authenticated: false }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },

      POST: async ({ request }) => {
        // Accepts JSON { accessToken, maxAge }
        try {
          const body = await request.json()
          const accessToken = body?.accessToken
          const maxAge = typeof body?.maxAge === 'number' ? body.maxAge : undefined

          if (!accessToken || typeof accessToken !== 'string') {
            return new Response(JSON.stringify({ error: 'accessToken required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
          if (!url) {
            return new Response(JSON.stringify({ error: 'server misconfigured' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          // Verify token with Supabase before setting cookie to prevent accepting arbitrary tokens.
          const verify = await fetch(`${url.replace(/\/$/, '')}/auth/v1/user`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })

          if (!verify.ok) {
            return new Response(JSON.stringify({ error: 'invalid token' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const setCookie = buildSetCookie(accessToken, maxAge ? { maxAge } : undefined)

          return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Set-Cookie': setCookie,
            },
          })
        } catch (err) {
          return new Response(JSON.stringify({ error: 'invalid JSON' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },

      DELETE: async () => {
        const clear = buildClearCookie()
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Set-Cookie': clear },
        })
      },
    },
  },
})
