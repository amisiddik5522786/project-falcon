import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '#/components/layout/app-shell.tsx'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <AppShell
      title="Project Falcon foundation"
      description="A clean starting point for an enterprise-grade commerce experience with a polished app shell, responsive layout, and room to grow."
    >
      <article className="rounded-2xl border border-border/80 bg-card/70 p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Shell
        </p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">Header & navigation</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The application shell now provides a minimal header and navigation structure for future product work.
        </p>
      </article>

      <article className="rounded-2xl border border-border/80 bg-card/70 p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Content
        </p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">Main area ready</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          A dedicated content section is in place for the next layer of product and platform foundations.
        </p>
      </article>

      <article className="rounded-2xl border border-border/80 bg-card/70 p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Footer
        </p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">Simple & consistent</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The footer keeps the experience grounded while remaining lightweight and responsive.
        </p>
      </article>
    </AppShell>
  )
}
