import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Skeleton } from '#/components/ui/skeleton'

export function BaseLoader() {
  return (
    <CardContent
      className={
        'scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400/50 scrollbar-track-transparent flex gap-4 snap-x snap-mandatory scroll-smooth scroll-fade-x p-4 overflow-x-auto'
      }
    >
      {Array.from({ length: 12 }).map((_, loadingIdx) => (
        <Card className={'w-full min-w-sm snap-start'} key={loadingIdx}>
          <CardHeader>
            <CardTitle>
              <Skeleton className={'h-4 w-32'} />
            </CardTitle>
            <CardDescription>
              <Skeleton className={'h-3 w-24'} />
            </CardDescription>
          </CardHeader>
          <CardContent className={'space-y-2'}>
            <Skeleton className={'h-4 w-16'} />
            <Skeleton className={'h-5 w-20'} />
          </CardContent>
          <CardFooter>
            <Skeleton className={'h-8 w-full'} />
          </CardFooter>
        </Card>
      ))}
    </CardContent>
  )
}

export function FallbackTestimonials() {
  return <BaseLoader />
}
export function FallbackIndividials() {
  return <BaseLoader />
}
export function FallbackHealthCategories() {
  return <BaseLoader />
}
export function FallbackPopularCategory() {
  return <BaseLoader />
}
export function FallbackHealthPackages() {
  return <BaseLoader />
}

export function FallbackTestItems() {
  return (
    <div
      className={
        'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
      }
    >
      {[...Array(5)].map((_, testIdx) => (
        <Card key={testIdx} className={'py-0 gap-4'}>
          <CardHeader
            className={'h-18 bg-primary py-2 text-accent content-center'}
          >
            <CardTitle>
              <Skeleton className={'h-4 w-32'} />
            </CardTitle>
          </CardHeader>

          <CardContent className={'space-y-4'}>
            <span className="block">
              Original Price: <Skeleton className={'h-4 w-16'} />
            </span>{' '}
            <span className="block">
              Discounted Price: <Skeleton className={'h-4 w-16'} />
            </span>
          </CardContent>

          <CardFooter className={'py-4'}>
            <Skeleton className={'h-10 w-full'} />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
