import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { MDXContent } from '@content-collections/mdx/react'
import { createLazyFileRoute } from '@tanstack/react-router'
import { termsAndCondition } from 'content-collections'
import { format } from 'date-fns'

export const Route = createLazyFileRoute('/terms-and-condition')({
  component: RouteComponent,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
})

function RouteComponent() {
  return (
    <main className={'mx-auto max-w-(--breakpoint-lg) space-y-8 px-4 py-12'}>
      <Card className={'rounded-none bg-transparent shadow-none ring-0'}>
        <CardHeader>
          <CardTitle>
            <h1>Terms and Conditions</h1>
          </CardTitle>
          <CardDescription>
            {/* new Date().toISOString() */}
            <p>{format(new Date(), 'MMMM dd, yyyy')}</p>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <article className="prose prose-sm max-w-none md:prose-base lg:prose-lg dark:prose-invert">
            <MDXContent code={termsAndCondition.mdx} />
          </article>
        </CardContent>
      </Card>
    </main>
  )
}

function ErrorComponent() {
  return (
    <div>
      <p>
        Oops! Something went wrong while loading the terms-and-condition policy.
        Please try again later.
      </p>
    </div>
  )
}

function PendingComponent() {
  return (
    <div>
      <p>Loading terms-and-condition policy...</p>
    </div>
  )
}

function NotFoundComponent() {
  return (
    <div>
      <p>Privacy terms-and-condition not found.</p>
    </div>
  )
}
