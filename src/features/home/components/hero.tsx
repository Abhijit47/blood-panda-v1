import { buttonVariants } from '#/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  FlaskConicalIcon,
  HomeIcon,
  PackageOpenIcon,
  PipetteIcon,
  StarIcon,
} from 'lucide-react'

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '#/components/ui/item'
import { cn } from '#/lib/utils'
import { Link } from '@tanstack/react-router'
import HeroSearch from './hero-search'

const heroStats = [
  {
    id: crypto.randomUUID(),
    stat: '4.9/5',
    description: 'Rating',
    icon: <StarIcon className={'stroke-destructive'} />,
    bgColor: 'bg-destructive/10',
  },
  {
    id: crypto.randomUUID(),
    stat: '10000+',
    description: 'Samples Collected ',
    icon: <PipetteIcon className={'stroke-green-500'} />,
    bgColor: 'bg-green-500/10',
  },
  {
    id: crypto.randomUUID(),
    stat: 'Free',
    description: 'Home Collection',
    icon: <HomeIcon className={'stroke-purple-500'} />,
    bgColor: 'bg-purple-500/10',
  },
  {
    id: crypto.randomUUID(),
    stat: 'Certified',
    description: 'Labs',
    icon: <FlaskConicalIcon className={'stroke-sky-500'} />,
    bgColor: 'bg-sky-500/10',
  },
]

export default function Hero() {
  return (
    <section
      className={
        'grid grid-cols-1 lg:grid-cols-2 place-items-center gap-4 relative aspect-auto sm:aspect-14/9 md:aspect-video lg:aspect-20/9 xl:aspect-24/9 mt-4'
      }
    >
      <div className={'w-full h-full absolute top-0 left-0'}>
        <img
          src="/hero-bg.png"
          alt="hero-bg"
          width={'100%'}
          height={'100%'}
          className={'w-full h-full object-cover rounded-3xl'}
        />
      </div>
      <Card className="z-10 bg-background/10 backdrop-blur-xs border-none ring-0 shadow-none border-0 h-full justify-center scroll-fade-e gap-4">
        <CardHeader>
          <CardDescription>
            <p className={'text-destructive font-semibold text-base'}>
              Bangalore's Trusted Partner for Diagnostic Care
            </p>
          </CardDescription>
          <CardTitle>
            <h1
              className={
                'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold'
              }
            >
              <span className={'text-foreground'}>Your Health.</span>{' '}
              <span className={'text-primary'}>Our Priority</span>
            </h1>
          </CardTitle>
        </CardHeader>
        <CardContent className={'space-y-4'}>
          <CardDescription>
            <p
              className={
                'text-sm md:text-base font-normal text-foreground lg:text-muted-foreground'
              }
            >
              With Blood Panda ,book trusted diagnostic tests and health
              packages from the comfort of your home. Fast sample collection,
              accurate reports, and expert care across Bangalore.
            </p>
          </CardDescription>

          <HeroSearch />

          <CardAction className={'space-x-2 justify-self-start'}>
            <Link
              to="/booking"
              viewTransition
              className={buttonVariants({
                className:
                  'bg-destructive! text-accent hover:bg-destructive/90',
              })}
            >
              <FlaskConicalIcon className="size-4" /> Book a Test
            </Link>
            <Link
              to="/tests"
              viewTransition
              className={buttonVariants({
                variant: 'outline',
                className:
                  'border-blue-600! border-2 text-blue-600 hover:bg-blue-600 hover:text-accent',
              })}
            >
              <PackageOpenIcon className="size-4" />
              Explore Packages
            </Link>
          </CardAction>
        </CardContent>
      </Card>

      <div className={'z-10 hidden lg:block'}>&nbsp;</div>

      <div
        className={
          'absolute -bottom-96 sm:-bottom-48 md:-bottom-40 lg:-bottom-24 xl:-bottom-12 z-10 bg-background rounded-xl border-0 w-full max-w-6xl px-4 lg:shadow-lg'
        }
        // className={
        //   'col-span-full justify-self-center z-10 bg-accent/10 backdrop-blur-lg border-none ring-0 shadow-none rounded-none border-0 w-full max-w-6xl scroll-fade-e'
        // }
      >
        <div
          className={
            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4'
          }
        >
          {heroStats.map((stat) => (
            <Item key={stat.id} variant={'outline'}>
              <ItemMedia
                variant="image"
                className={cn('my-auto p-0.5 rounded-full', `${stat.bgColor}`)}
              >
                {stat.icon}
              </ItemMedia>
              <ItemContent>
                <ItemTitle className={'font-semibold text-base'}>
                  {stat.stat}
                </ItemTitle>
                <ItemDescription className={'font-medium'}>
                  {stat.description}
                </ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </div>
      </div>
    </section>
  )
}
