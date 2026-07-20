import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { allPosts } from 'content-collections'

import { Badge } from '#/components/ui/badge'
import { buttonVariants } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { MDXContent } from '@content-collections/mdx/react'
import { format } from 'date-fns'
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react'

export const Route = createFileRoute('/blogs/$blogId/')({
  loader: ({ params }) => {
    const data = allPosts.find((post) => post._meta.path === params.blogId)

    if (!data) {
      throw redirect({ to: '/blogs' })
    }

    return data
  },
  component: RouteComponent,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
})

function RouteComponent() {
  const currentPost = Route.useLoaderData()

  const sortedPosts = allPosts.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    // const dateA = new Date(a.lastModified).getTime()
    // const dateB = new Date(b.lastModified).getTime()
    return dateA - dateB // Sort by last modified date (oldest to newest)
  })

  const currentIndex = sortedPosts.findIndex((post) => post.slug === post.slug)

  const previousPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null
  const nextPost =
    currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null

  return (
    <main className={'mx-auto max-w-(--breakpoint-lg) space-y-8 px-4 py-12'}>
      <Card className={'rounded-none bg-transparent shadow-none ring-0'}>
        <CardHeader>
          <CardTitle>
            <h1 className={'text-center text-3xl font-semibold'}>
              {currentPost.title}
            </h1>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <img
            src={currentPost.image}
            alt={currentPost.title}
            width={'100%'}
            height={'100%'}
            className={'h-full w-full'}
          />
        </CardContent>

        <CardContent className={'flex items-center justify-between'}>
          <Link to={'/blogs'} className={buttonVariants()} viewTransition>
            <ChevronLeftCircle className={'size-4'} />
            Go back to blogs
          </Link>
        </CardContent>

        <CardContent className={'border-t border-b py-2'}>
          <div className={'flex items-center justify-between gap-2'}>
            <p>
              By
              <Badge variant={'outline'}>{currentPost.author}</Badge>
            </p>

            <p>{currentPost.readTime} min read</p>

            <p>
              Published on
              <Badge variant={'outline'}>
                {format(new Date(currentPost.createdAt), 'MMMM dd, yyyy')}
              </Badge>
            </p>
          </div>
        </CardContent>

        <CardContent>
          <article className="prose prose-sm max-w-none md:prose-base lg:prose-lg dark:prose-invert">
            <MDXContent code={currentPost.mdx} />
          </article>
        </CardContent>

        <CardFooter className={'justify-between'}>
          <Link
            // to={previousPost ? `blogs/${previousPost.slug}` : "#"}
            to={previousPost ? `${previousPost._meta.path}` : '#'}
            className={buttonVariants()}
            viewTransition
          >
            <ChevronLeftCircle className={'size-4'} />
            Prev
          </Link>
          <Link
            to={nextPost ? `${nextPost._meta.path}` : '#'}
            className={buttonVariants()}
            viewTransition
          >
            Next
            <ChevronRightCircle className={'size-4'} />
          </Link>
        </CardFooter>
      </Card>
    </main>
  )
}

function ErrorComponent() {
  return (
    <div>
      <p>
        Oops! Something went wrong while loading the blogs. Please try again
        later.
      </p>
    </div>
  )
}

function PendingComponent() {
  return (
    <div>
      <p>Loading blogs...</p>
    </div>
  )
}

function NotFoundComponent() {
  return (
    <div>
      <p>Blogs not found.</p>
    </div>
  )
}
