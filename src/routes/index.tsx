import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '#/components/layout/app-shell.tsx'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <AppShell
      title="Project Falcon workspace"
      description="A polished enterprise-style application shell for the next commerce platform iteration, with responsive navigation and modular layout foundations."
    >
      <article className="rounded-[24px] border border-border/80 bg-card/70 p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Workspace
        </p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">Operational overview</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The shell is structured for future dashboards, commerce operations, and admin workflows.
        </p>
      </article>

      <article className="rounded-[24px] border border-border/80 bg-card/70 p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Navigation
        </p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">Enterprise-ready structure</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Sidebar, header controls, and mobile drawer patterns are in place for consistent product growth.
        </p>
      </article>

      <article className="rounded-[24px] border border-border/80 bg-card/70 p-5 shadow-sm md:col-span-2">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Foundation
        </p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">Production-ready layout building blocks</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          This page is intentionally limited to layout, styling, and navigation so the core architecture remains modular and easy to extend.
        </p>
      </article>
    </AppShell>
  )
}
