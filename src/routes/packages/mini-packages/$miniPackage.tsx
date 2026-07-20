import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/packages/mini-packages/$miniPackage')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/packages/mini-packages/$miniPackage"!</div>
}
