import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/booking')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/booking"!</div>
}
