import type { ReactNode } from 'react'
import { Button } from '#/components/ui/button.tsx'

interface AppShellProps {
  title: string
  description: string
  children: ReactNode
}

export function AppShell({ title, description, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-foreground">
      <header className="border-b border-border/70 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-muted-foreground">
              Project Falcon
            </p>
            <a href="/" className="text-lg font-semibold text-foreground">
              Foundation
            </a>
          </div>

          <nav className="hidden items-center gap-2 sm:flex">
            <Button variant="ghost" size="sm">
              Overview
            </Button>
            <Button variant="outline" size="sm">
              Platform
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <section className="rounded-3xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur sm:p-8">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-muted-foreground">
                Enterprise foundation
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {title}
              </h1>
              <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
                {description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button>Open workspace</Button>
                <Button variant="outline">Review structure</Button>
              </div>
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-3">{children}</div>
        </div>
      </main>

      <footer className="border-t border-border/70 bg-background/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 Project Falcon</p>
          <p>Minimal foundation for the next enterprise commerce experience.</p>
        </div>
      </footer>
    </div>
  )
}
