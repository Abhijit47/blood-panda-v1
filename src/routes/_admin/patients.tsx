import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/patients')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_admin/patients"!</div>
}
