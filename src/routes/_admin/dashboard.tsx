import { Button } from '#/components/ui/button'
import { Spinner } from '#/components/ui/spinner'
import { seo } from '#/constants/seo-details'
import { getSession } from '@/lib/auth.functions'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'

// import data from '#/dashboard/data.json'

export const Route = createFileRoute('/_admin/dashboard')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) {
      throw redirect({ to: '/login' })
    }
    return { user: session.user }
  },
  head: () => seo('/dashboard'),
  component: Dashboard,
  pendingComponent: PendingComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  wrapInSuspense: true,
  codeSplitGroupings: [
    ['component', 'pendingComponent', 'errorComponent', 'notFoundComponent'],
  ],
})

function Dashboard() {
  const { user } = Route.useRouteContext()

  return <div>Welcome, {user.name}!</div>
}

function PendingComponent() {
  return (
    <div
      className={
        'mx-auto max-w-(--breakpoint-lg) flex flex-col items-center justify-center h-[calc(100dvh-16rem)]'
      }
    >
      <Spinner className={'size-6'} />
    </div>
  )
}

function NotFoundComponent() {
  return (
    <div className={'mx-auto max-w-(--breakpoint-lg) space-y-8 px-4 py-12'}>
      <h2 className={'text-center text-3xl font-bold'}>Page Not Found</h2>
    </div>
  )
}

function ErrorComponent({ error }: { error: Error }) {
  const router = useRouter()
  return (
    <div className="error">
      <h2>An error occurred: {error.name}</h2>
      <p>{error.message}</p>
      <Button onClick={() => router.navigate({ to: '/', search: {} })}>
        Go Home
      </Button>
    </div>
  )
}
