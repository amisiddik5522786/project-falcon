import { initAuth, watchAuthChanges } from './index'

let unsubscribe: (() => void) | null = null

export async function startAuthClient() {
  try {
    // initialize once
    // guard against multiple HMR reloads
    const anyWin = window as any
    if (anyWin.__pf_auth_started) return
    anyWin.__pf_auth_started = true

    await initAuth()
    const stop = watchAuthChanges()
    unsubscribe = stop

    // HMR cleanup
    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        if (unsubscribe) unsubscribe()
        anyWin.__pf_auth_started = false
      })
    }
  } catch (err) {
    // Do not surface auth errors during init
  }
}

export function stopAuthClient() {
  if (unsubscribe) unsubscribe()
  const anyWin = window as any
  anyWin.__pf_auth_started = false
}

export default { startAuthClient, stopAuthClient }
