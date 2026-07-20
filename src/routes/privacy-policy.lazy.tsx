import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { MDXContent } from '@content-collections/mdx/react'
import { createLazyFileRoute } from '@tanstack/react-router'
import { privacyPolicy } from 'content-collections'

export const Route = createLazyFileRoute('/privacy-policy')({
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
            <h1>Privacy Policy</h1>
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>

        <CardContent>
          <article className="prose prose-sm max-w-none md:prose-base lg:prose-lg dark:prose-invert">
            <MDXContent code={privacyPolicy.mdx} />
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
        Oops! Something went wrong while loading the privacy policy. Please try
        again later.
      </p>
    </div>
  )
}

function PendingComponent() {
  return (
    <div>
      <p>Loading privacy policy...</p>
    </div>
  )
}

function NotFoundComponent() {
  return (
    <div>
      <p>Privacy policy not found.</p>
    </div>
  )
}
