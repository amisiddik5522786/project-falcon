import { LayoutDashboard, Package, Settings, ShoppingCart, Users } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'

import { AppSidebar } from '#/components/layout/app-sidebar.tsx'
import { MobileDrawer } from '#/components/layout/mobile-drawer.tsx'
import { TopBar } from '#/components/layout/top-bar.tsx'

interface AppShellProps {
  title: string
  description: string
  children: ReactNode
}

export function AppShell({ title, description, children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('project-falcon-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const nextValue = storedTheme ? storedTheme === 'dark' : prefersDark
    setIsDark(nextValue)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    window.localStorage.setItem('project-falcon-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const navItems = [
    { label: 'Overview', href: '/', icon: LayoutDashboard, active: true },
    { label: 'Orders', href: '/orders', icon: ShoppingCart },
    { label: 'Customers', href: '/customers', icon: Users },
    { label: 'Operations', href: '/operations', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} items={navItems} />

        <div className="flex min-h-screen flex-1 flex-col">
          <TopBar onMenuToggle={() => setMobileOpen(true)} isDark={isDark} onThemeToggle={setIsDark} />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-6">
              <section className="rounded-[28px] border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.36em] text-muted-foreground">
                      Enterprise foundation
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                      {title}
                    </h1>
                    <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
                      {description}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Package className="size-4 text-primary" />
                      <span>Modular platform shell ready for future commerce workflows.</span>
                    </div>
                  </div>
                </div>
              </section>

              <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="grid gap-4 md:grid-cols-2">{children}</div>

                <aside className="rounded-[24px] border border-border/70 bg-card/80 p-5 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                    Platform status
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-foreground">Operational shell</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    The layout now includes a full navigation experience suitable for an enterprise admin surface.
                  </p>
                  <div className="mt-6 space-y-3">
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                      <p className="text-sm font-medium text-foreground">Responsive navigation</p>
                      <p className="mt-1 text-sm text-muted-foreground">Desktop sidebar, mobile drawer, and compact controls.</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                      <p className="text-sm font-medium text-foreground">Workspace controls</p>
                      <p className="mt-1 text-sm text-muted-foreground">Search, notifications, profile, and theme switching are built in.</p>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </main>

          <footer className="border-t border-border/70 bg-background/70">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <p>© 2026 Project Falcon</p>
              <p>Responsive application shell for the next commerce platform iteration.</p>
            </div>
          </footer>
        </div>
      </div>

      <MobileDrawer open={mobileOpen} onOpenChange={setMobileOpen} items={navItems} />
    </div>
  )
}
