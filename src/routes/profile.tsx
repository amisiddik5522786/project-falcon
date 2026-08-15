import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '#/components/layout/app-shell.tsx'
import { useEffect, useState } from 'react'
import { Card } from '#/components/ui/card.tsx'

export const Route = createFileRoute('/profile')({ component: Profile })

function Profile() {
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/auth/session')
        const data = await res.json()
        if (!mounted) return
        setEmail(data?.email ?? null)
      } catch (err) {
        // ignore
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <AppShell title="Profile Settings" description="Manage your account settings.">
      <div className="rounded-[24px] border border-border/80 bg-card/70 p-5 shadow-sm md:col-span-2">
        <Card>
          <h3 className="text-lg font-semibold">Profile</h3>
          <p className="mt-2 text-sm text-muted-foreground">This is a placeholder for profile settings.</p>
          <div className="mt-4">
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-foreground">{loading ? 'Loading…' : email ?? 'Not signed in'}</p>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
