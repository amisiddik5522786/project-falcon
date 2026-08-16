import { Bell, ChevronDown, Menu, Moon, Search, Sun, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Switch } from '#/components/ui/switch.tsx'
import { cn } from '#/lib/utils.ts'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '#/components/ui/dropdown-menu.tsx'
import auth from '#/lib/auth/index.ts'
import getBrowserSupabaseClient from '#/lib/supabase/browser-client.ts'
import { Spinner } from '#/components/ui/spinner.tsx'

interface TopBarProps {
  onMenuToggle: () => void
  isDark: boolean
  onThemeToggle: (value: boolean) => void
}

function UserNameAndRole() {
  const supabase = getBrowserSupabaseClient()
  const [name, setName] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        const { data: userData } = await supabase.auth.getUser()
        const authUser = userData?.user ?? null
        if (!mounted) return

        if (!authUser) return

        // Try to fetch profile; if not found, fall back to email local part
        const { data, error } = await supabase.from('profiles').select('display_name, avatar_url, role').eq('id', authUser.id).maybeSingle()
        if (!mounted) return

        if (error) {
          // Surface RLS/db errors silently by leaving defaults
          setName(authUser.email ?? null)
          return
        }

        if (data) {
          setName(data.display_name ?? authUser.email ?? null)
          setRole(data.role ?? null)

          if (data.avatar_url) {
            const { data: signed } = await supabase.storage
              .from('avatars')
              .createSignedUrl(data.avatar_url, 60 * 60)
            if (mounted) setAvatarUrl(signed?.signedUrl ?? null)
          } else {
            setAvatarUrl(null)
          }
        } else {
          setName(authUser.email ?? null)
          setAvatarUrl(null)
        }
      } catch (err) {
        // ignore errors; keep defaults
      }
    })()

    return () => {
      mounted = false
    }
  }, [supabase])

  useEffect(() => {
    const handler = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser()
        const authUser = userData?.user ?? null
        if (!authUser) return
        const { data } = await supabase.from('profiles').select('display_name, avatar_url, role').eq('id', authUser.id).maybeSingle()
        if (data) {
          setName(data.display_name ?? authUser.email ?? null)
          setRole(data.role ?? null)

          if (data.avatar_url) {
            const { data: signed } = await supabase.storage
              .from('avatars')
              .createSignedUrl(data.avatar_url, 60 * 60)
            setAvatarUrl(signed?.signedUrl ?? null)
          } else {
            setAvatarUrl(null)
          }
        }
      } catch (e) {
        // ignore
      }
    }

    window.addEventListener('profile:updated', handler as EventListener)
    return () => window.removeEventListener('profile:updated', handler as EventListener)
  }, [supabase])

  return (
    <>
      <p className="text-sm font-medium text-foreground">{name ?? 'Account'}</p>
      <p className="text-xs text-muted-foreground">{role ?? ''}</p>
    </>
  )
}

export function TopBar({ onMenuToggle, isDark, onThemeToggle }: TopBarProps) {
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <header className="border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={onMenuToggle}>
          <Menu className="size-4" />
        </Button>

        <div className="flex flex-1 items-center gap-3">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-10 rounded-2xl border-border/70 bg-background/90 pl-9 shadow-none"
              placeholder="Search workspace"
              aria-label="Search workspace"
            />
          </label>

          <Button variant="ghost" size="icon-sm" className="relative shrink-0">
            <Bell className="size-4" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary" />
          </Button>

          <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-muted/50 px-2 py-1 sm:flex">
            <Sun className="size-4 text-muted-foreground" />
            <Switch checked={isDark} onCheckedChange={onThemeToggle} size="sm" />
            <Moon className="size-4 text-muted-foreground" />
          </div>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 rounded-full px-2 py-1.5">
                  <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound className="size-4" />
                    )}
                  </div>
                  <div className="hidden text-left sm:block">
                    <UserNameAndRole />
                  </div>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>

              <AccountMenuContent />
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

function AccountMenuContent() {
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    if (loading) return
    setLoading(true)
    try {
      await auth.signOut()
      // navigate to login
      window.location.assign('/login')
    } catch (err) {
      // show minimal feedback via alert for now
      // avoid leaking details
      // eslint-disable-next-line no-alert
      alert('Logout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenuContent align="end" sideOffset={8} className="w-48 rounded-2xl border border-border/70 bg-popover p-2 shadow-lg">
      <DropdownMenuLabel>Account</DropdownMenuLabel>
      <DropdownMenuItem asChild>
        <a href="/profile" className="w-full rounded-lg px-2 py-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground">Profile settings</a>
      </DropdownMenuItem>

      <DropdownMenuItem asChild>
        <a href="/team-preferences" className="w-full rounded-lg px-2 py-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground">Team preferences</a>
      </DropdownMenuItem>

      <DropdownMenuItem onSelect={handleLogout} disabled={loading} className="w-full rounded-lg px-2 py-2 text-left text-sm text-destructive">
        {loading ? <Spinner label="Signing out" /> : 'Log out'}
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
