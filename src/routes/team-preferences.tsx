import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '#/components/layout/app-shell.tsx'
import { Card } from '#/components/ui/card.tsx'

export const Route = createFileRoute('/team-preferences')({ component: TeamPreferences })

function TeamPreferences() {
  return (
    <AppShell title="Team Preferences" description="Manage team-level settings.">
      <div className="rounded-[24px] border border-border/80 bg-card/70 p-5 shadow-sm md:col-span-2">
        <Card>
          <h3 className="text-lg font-semibold">Team Preferences</h3>
          <p className="mt-2 text-sm text-muted-foreground">Placeholder settings for team preferences. Controls are illustrative only.</p>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm font-medium">Default workspace view</p>
              <p className="text-sm text-muted-foreground">(Placeholder) Select default view for team members.</p>
            </div>
            <div>
              <p className="text-sm font-medium">Notification policy</p>
              <p className="text-sm text-muted-foreground">(Placeholder) Notification preferences will be configurable here.</p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

