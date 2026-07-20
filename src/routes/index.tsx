import { Spinner } from '#/components/ui/spinner'
import { getTests } from '#/lib/tests.functions'
import { Await, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  loader: async () => {
    const deferred = getTests()

    return { deferred }
  },
  component: App,
})

function App() {
  const result = Route.useLoaderData()
  return (
    <main className={'mx-auto max-w-(--breakpoint-xl) space-y-8 px-4 py-12'}>
      <Await
        promise={result.deferred}
        fallback={
          <div className={'flex items-center justify-center h-dvh gap-2'}>
            <Spinner className={'size-6'} />
            Loading...
          </div>
        }
      >
        {(data) => {
          return <>{JSON.stringify(data, null, 2)}</>
        }}
      </Await>
    </main>
  )
}
