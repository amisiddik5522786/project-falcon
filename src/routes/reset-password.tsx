import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '#/components/layout/app-shell.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Label } from '#/components/ui/label.tsx'
import { Button } from '#/components/ui/button.tsx'
import { useEffect, useState } from 'react'
import auth from '#/lib/auth/index.ts'

export const Route = createFileRoute('/reset-password')({ component: ResetPassword })

function ResetPassword() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const at = params.get('access_token')
      if (at) setAccessToken(at)
    } catch (err) {
      // ignore
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (loading) return
    if (!password) return setError('Password is required')
    if (password !== confirm) return setError('Passwords do not match')
    if (!accessToken) return setError('No access token found. Use the link in your email.')

    setLoading(true)
    const res = await auth.confirmPasswordReset(accessToken, password)
    setLoading(false)

    if (res?.error) {
      setError(res.error.message || String(res.error))
      return
    }

    setSuccess('Password updated. You can now sign in with your new password.')
  }

  return (
    <AppShell title="Set a new password" description="Update your account password.">
      <div className="rounded-[24px] border border-border/80 bg-card/70 p-5 shadow-sm md:col-span-2">
        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="mb-4">
            <Label htmlFor="password">New password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="mb-4">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>

          {error && <div className="mb-3 text-sm text-destructive">{error}</div>}
          {success && <div className="mb-3 text-sm text-green-600">{success}</div>}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading}>{loading ? 'Updating…' : 'Update password'}</Button>
            <a className="ml-auto text-sm text-primary" href="/login">Back to Login</a>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
