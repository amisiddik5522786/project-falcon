import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '#/components/layout/app-shell.tsx'
import { Button } from '#/components/ui/button.tsx'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <AppShell
      title="Project Falcon workspace"
      description="A clean, modular foundation for the next enterprise commerce experience with responsive navigation and a scalable design system."
    >
      <article className="rounded-[24px] border border-border/80 bg-card/70 p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">Foundation</p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">Platform shell ready</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">The home experience stays focused on structure and layout while the design-system route hosts the component previews.</p>
      </article>

      <article className="rounded-[24px] border border-border/80 bg-card/70 p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">Design system</p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">Shadcn-aligned primitives</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Reusable components and system tokens are now organized for future product surfaces and workflows.</p>
      </article>

      <article className="rounded-[24px] border border-border/80 bg-card/70 p-5 shadow-sm md:col-span-2">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">Next step</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button>Review shell</Button>
          <Button variant="outline" onClick={() => window.location.assign('/design-system')}>Open design system</Button>
        </div>
      </article>
    </AppShell>
  )
}
