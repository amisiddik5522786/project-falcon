import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/design-system')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/design-system"!</div>
}
