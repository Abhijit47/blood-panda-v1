import { Spinner } from '#/components/ui/spinner'
import Blogs from '#/features/home/components/blogs'
import BookingSteps from '#/features/home/components/booking-steps'
import CTA from '#/features/home/components/cta'
import FAQs from '#/features/home/components/faqs'
import Features from '#/features/home/components/features'
import HealthCategory from '#/features/home/components/health-category'
import Hero from '#/features/home/components/hero'
import HowItWorks from '#/features/home/components/how-it-works'
import IndividualCategory from '#/features/home/components/individual-category'
import PopularPackages from '#/features/home/components/popular-packages'
import Testimonials from '#/features/home/components/testimonials.lazy'
import WhyChooseUs from '#/features/home/components/why-choose-us'
import { getAllTests } from '#/lib/tests.functions'
import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  loader: async () => {
    const deferred = getAllTests()

    return { deferred }
  },
  component: App,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
  wrapInSuspense: true,
  codeSplitGroupings: [
    [
      'loader',
      'component',
      'pendingComponent',
      'errorComponent',
      'notFoundComponent',
    ],
  ],
})

// const TestimonialsLazy = lazy(
//   () => import('#/features/home/components/testimonials.lazy'),
// )
function App() {
  const result = Route.useLoaderData()
  return (
    <main className={'mx-auto max-w-(--breakpoint-xl) space-y-8 px-4'}>
      <Hero />
      <Features />
      <PopularPackages />
      <HealthCategory />
      <IndividualCategory />
      <BookingSteps />
      <WhyChooseUs />
      <Testimonials />
      <HowItWorks />
      <Blogs />
      <CTA />
      <FAQs />
    </main>
  )
}

function PendingComponent() {
  return (
    <div
      className={
        'mx-auto max-w-(--breakpoint-lg) flex flex-col items-center justify-center h-dvh'
      }
    >
      <Spinner className={'size-6'} />
    </div>
  )
}

function NotFoundComponent() {
  return (
    <div className={'mx-auto max-w-(--breakpoint-lg) space-y-8 px-4 py-12'}>
      Tests Not Found
    </div>
  )
}

function ErrorComponent({ error }: { error: Error }) {
  const router = useRouter()
  return (
    <div className="error">
      <h2>Invalid Search Parameters</h2>
      <p>{error.message}</p>
      <button onClick={() => router.navigate({ to: '/tests', search: {} })}>
        Reset Search
      </button>
    </div>
  )
}
