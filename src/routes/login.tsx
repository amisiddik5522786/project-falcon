import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '#/components/layout/app-shell.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Label } from '#/components/ui/label.tsx'
import { Button } from '#/components/ui/button.tsx'
import { useState } from 'react'
import auth from '#/lib/auth/index.ts'

export const Route = createFileRoute('/login')({ component: Login })

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (loading) return
    if (!email) return setError('Email is required')
    if (!password) return setError('Password is required')

    setLoading(true)
    const res = await auth.signIn(email, password)
    setLoading(false)

    if (res?.error) {
      setError(res.error.message || String(res.error))
      return
    }

    // on success, redirect to home
    window.location.assign('/')
  }

  return (
    <AppShell title="Sign in" description="Access your Project Falcon workspace.">
      <div className="rounded-[24px] border border-border/80 bg-card/70 p-5 shadow-sm md:col-span-2">
        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <div className="mb-3 text-sm text-destructive">{error}</div>}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</Button>
            <a className="text-sm text-muted-foreground underline" href="/forgot-password">Forgot password?</a>
            <a className="ml-auto text-sm text-primary" href="/signup">Sign up</a>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
