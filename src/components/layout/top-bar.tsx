import { Bell, ChevronDown, Menu, Moon, Search, Sun, UserRound } from 'lucide-react'
import { useState } from 'react'

import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Switch } from '#/components/ui/switch.tsx'
import { cn } from '#/lib/utils.ts'

interface TopBarProps {
  onMenuToggle: () => void
  isDark: boolean
  onThemeToggle: (value: boolean) => void
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

          <div className="relative">
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-full px-2 py-1.5"
              onClick={() => setProfileOpen((open) => !open)}
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRound className="size-4" />
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-foreground">Ava Carter</p>
                <p className="text-xs text-muted-foreground">Operations Lead</p>
              </div>
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-border/70 bg-popover p-2 shadow-lg">
                <p className="px-2 py-2 text-sm font-medium text-foreground">Account</p>
                <button className="w-full rounded-lg px-2 py-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                  Profile settings
                </button>
                <button className="w-full rounded-lg px-2 py-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                  Team preferences
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
