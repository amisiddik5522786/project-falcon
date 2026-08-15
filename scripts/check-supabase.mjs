import fs from 'fs'
import path from 'path'

function loadDotenv(envPath) {
  try {
    const raw = fs.readFileSync(envPath, 'utf8')
    const lines = raw.split(/\r?\n/)
    for (const line of lines) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)=(.*)$/)
      if (!m) continue
      const [, k, v] = m
      // strip surrounding quotes
      const val = v.replace(/^\s*"(.*)"\s*$/,'$1').replace(/^\s*'(.*)'\s*$/,'$1')
      if (!(k in process.env)) process.env[k] = val
    }
  } catch (err) {
    // no .env present — that's fine for this check
  }
}

function safePrint(msg) {
  // Only print short, non-secret messages
  console.log(msg)
}

async function run() {
  const projectRoot = process.cwd()
  const envPath = path.join(projectRoot, '.env')

  loadDotenv(envPath)

  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!url) {
    safePrint('ERROR: Supabase URL is not defined in environment')
    process.exitCode = 2
    return
  }

  if (!anonKey) {
    safePrint('ERROR: Supabase anon key is not defined in environment')
    process.exitCode = 2
    return
  }

  // Basic format checks
  try {
    const u = new URL(url)
    if (!u.protocol.startsWith('http')) throw new Error('invalid protocol')
  } catch (err) {
    safePrint('ERROR: Supabase URL does not appear to be a valid URL')
    process.exitCode = 2
    return
  }

  if (typeof anonKey !== 'string' || anonKey.length < 20) {
    safePrint('ERROR: Supabase anon key does not appear valid')
    process.exitCode = 2
    return
  }

  // Try to instantiate the client (ensure dependency is available).
  try {
    const { createClient } = await import('@supabase/supabase-js')
    // instantiate but do not use the client
    createClient(url, anonKey)
  } catch (err) {
    safePrint('ERROR: Failed to instantiate Supabase client library')
    process.exitCode = 2
    return
  }

  safePrint('OK: Supabase env loaded and client instantiated (key not shown)')
}

run()
