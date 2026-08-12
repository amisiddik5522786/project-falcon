import type { ReactNode } from 'react'

import { Button } from '#/components/ui/button.tsx'
import { Card } from '#/components/ui/card.tsx'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="border-dashed p-8 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-3">
        <div className="rounded-full border border-border/70 bg-muted/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Empty state
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        {action ? <div className="mt-2">{action}</div> : <Button variant="outline">Review setup</Button>}
      </div>
    </Card>
  )
}
