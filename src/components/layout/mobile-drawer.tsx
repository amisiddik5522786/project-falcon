import { BadgeCheck, LayoutDashboard, Menu, Package, Search, Settings, ShoppingCart, Users, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import { cn } from '#/lib/utils.ts'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  active?: boolean
}

interface MobileDrawerProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  items: NavItem[]
}

export function MobileDrawer({ open, onOpenChange, items }: MobileDrawerProps) {
  return (
    <div className={cn('fixed inset-0 z-50 lg:hidden', open ? 'pointer-events-auto' : 'pointer-events-none')}>
      <div
        className={cn(
          'absolute inset-0 bg-background/70 backdrop-blur transition-opacity duration-200',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={() => onOpenChange(false)}
      />

      <aside
        className={cn(
          'absolute left-0 top-0 flex h-full w-80 flex-col border-r border-border/70 bg-background transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl border border-border/70 bg-muted text-foreground">
              <Package className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Project Falcon</p>
              <p className="text-xs text-muted-foreground">Mobile workspace</p>
            </div>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={() => onOpenChange(false)}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="px-4 py-4">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="h-10 rounded-2xl border-border/70 pl-9 shadow-none" placeholder="Search" />
          </label>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                  item.active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </a>
            )
          })}
        </nav>

        <div className="border-t border-border/70 p-3">
          <div className="rounded-2xl border border-border/70 bg-muted/60 p-3">
            <div className="flex items-center gap-2">
              <BadgeCheck className="size-4 text-primary" />
              <p className="text-sm font-medium text-foreground">Enterprise shell</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Responsive navigation and workspace controls are ready for expansion.</p>
          </div>
        </div>
      </aside>
    </div>
  )
}
