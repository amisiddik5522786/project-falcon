import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '#/components/layout/app-shell.tsx'

export const Route = createFileRoute('/products')({ component: Products })

function Products() {
  return (
    <AppShell
      title="Products"
      description="Manage your product catalog."
    >
      <div>
        Products page
      </div>
    </AppShell>
  )
}
