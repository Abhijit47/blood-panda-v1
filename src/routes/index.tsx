import { prisma } from '#/db'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

export const getTests = createServerFn().handler(async () => {
  const records = await prisma.bloodTest.findMany({})
  return records
})

export const Route = createFileRoute('/')({
  loader: async () => await getTests(),
  component: App,
})

function App() {
  const data = Route.useLoaderData()
  return (
    <main>
      HOME
      {JSON.stringify(data, null, 2)}
    </main>
  )
}
