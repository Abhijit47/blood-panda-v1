import { getSession } from '#/lib/auth.functions'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ location }) => {
    const session = await getSession()
    if (session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
    return null
  },
  component: () => <Outlet />,
})
