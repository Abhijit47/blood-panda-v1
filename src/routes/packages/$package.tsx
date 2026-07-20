import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/packages/$package')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/packages/package"!</div>
}
