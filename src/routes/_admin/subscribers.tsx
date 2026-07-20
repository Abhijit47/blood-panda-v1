import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/subscribers')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_admin/subscribers"!</div>
}
