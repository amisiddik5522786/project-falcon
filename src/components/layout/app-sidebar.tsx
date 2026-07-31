import { BadgeCheck, Boxes, LayoutDashboard, Package, PanelLeftClose, PanelLeftOpen, Settings, ShoppingCart, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { cn } from '#/lib/utils.ts'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  active?: boolean
}

interface AppSidebarProps {
  collapsed: boolean
  onToggle: () => void
  items: NavItem[]
}

export function AppSidebar({ collapsed, onToggle, items }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        'hidden h-screen flex-col border-r border-border/70 bg-background/80 backdrop-blur lg:flex',
        collapsed ? 'w-20' : 'w-72',
      )}
    >
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-4">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="flex size-9 items-center justify-center rounded-xl border border-border/70 bg-muted text-foreground">
            <Package className="size-4" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold text-foreground">Project Falcon</p>
              <p className="text-xs text-muted-foreground">Commerce OS</p>
            </div>
          )}
        </div>

        <Button variant="ghost" size="icon-sm" onClick={onToggle} className="shrink-0">
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                item.active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                collapsed && 'justify-center px-2',
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </a>
          )
        })}
      </nav>

      <div className="border-t border-border/70 p-3">
        <div className="rounded-2xl border border-border/70 bg-muted/60 p-3">
          <div className="flex items-center gap-2">
            <BadgeCheck className="size-4 text-primary" />
            <p className="text-sm font-medium text-foreground">Operations ready</p>
          </div>
          {!collapsed && <p className="mt-2 text-sm leading-6 text-muted-foreground">A modular shell for dashboards, commerce workflows, and team collaboration.</p>}
        </div>
      </div>
    </aside>
  )
}
