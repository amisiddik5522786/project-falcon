import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let serverClient: SupabaseClient | null = null

/**
 * Create a Supabase server client using the service role key.
 * This should only be used in server-side code (server functions, route.server handlers).
 */
export function getServerSupabaseClient() {
  if (serverClient) return serverClient

  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRole) {
    console.warn('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined in the server environment')
  }

  serverClient = createClient(url ?? '', serviceRole ?? '')

  return serverClient
}

export default getServerSupabaseClient
