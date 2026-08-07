import AutoPlay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect, useState } from 'react'

import { Card } from '#/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '#/components/ui/carousel'

import { buttonVariants } from '#/components/ui/button'
import type { CarouselApi } from '#/components/ui/carousel'
import { Progress } from '#/components/ui/progress'
import { useMediaQuery } from '#/hooks/use-media-query'
import { cn } from '#/lib/utils'
import { Link } from '@tanstack/react-router'
import { FlaskConicalIcon, PackageOpenIcon } from 'lucide-react'

const isDev = import.meta.env.DEV

const heroSlides = [
  {
    id: crypto.randomUUID(),
    bg: '/hero-new-bg-1.png',
  },
  {
    id: crypto.randomUUID(),
    bg: '/hero-new-bg-2.jpeg',
  },
  {
    id: crypto.randomUUID(),
    bg: '/hero-new-bg-3.jpeg',
  },
  {
    id: crypto.randomUUID(),
    bg: '/hero-new-bg-4.jpeg',
  },
]

export default function HeroCarouselV2() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [progress, setProgress] = useState(0)
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      skipSnaps: true,
      axis: 'x',
      dragFree: true,
      dragThreshold: 10,
    },
    [
      ...(!isDev
        ? [
            AutoPlay({
              delay: 5000,
              stopOnInteraction: false,
            }),
          ]
        : []),
    ],
  )

  const isMobile = useMediaQuery({ query: `max-width: 575px` })

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  useEffect(() => {
    if (!api) return

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1
        if (newProgress >= 100 && !isDev) {
          if (api.selectedScrollSnap() === api.scrollSnapList().length - 1) {
            api.scrollTo(0)
          } else {
            api.scrollNext()
          }
          return 0
        }
        return newProgress
      })
    }, 1200)

    return () => clearInterval(interval)
  }, [api])

  return (
    <Carousel
      ref={emblaRef}
      setApi={setApi}
      className="w-full h-full overflow-x-hidden"
    >
      <CarouselContent>
        {heroSlides.map((item, index) => (
          <CarouselItem key={item.id}>
            <div className="p-1">
              <Card className="group/card relative aspect-square sm:aspect-video md:aspect-14/9 lg:aspect-20/9 overflow-hidden border-0 p-0">
                <img
                  src={item.bg}
                  alt={`Slide ${index + 1}`}
                  width={800}
                  height={800}
                  className="absolute inset-0 size-full"
                />

                {index === 0 ? (
                  <div
                    className={cn(
                      'absolute h-fit w-fit',
                      isMobile ? 'bottom-4 left-3/12' : 'bottom-8 left-3/12',
                    )}
                  >
                    <div className={'flex items-center gap-2'}>
                      <Link
                        to="/booking"
                        viewTransition
                        className={buttonVariants({
                          className:
                            'bg-destructive! text-accent hover:bg-destructive/90',
                          size: isMobile ? 'sm' : 'lg',
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
                          size: isMobile ? 'sm' : 'lg',
                        })}
                      >
                        <PackageOpenIcon className="size-4" />
                        Explore Packages
                      </Link>
                    </div>
                  </div>
                ) : null}
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Progress Bar */}
      <div className="flex justify-center gap-2 py-3 w-full px-6">
        {Array.from({ length: count }).map((_, index) => (
          <Progress
            key={index}
            value={index === current ? progress : 0}
            className="h-1 w-full bg-muted-foreground/30! text-background!"
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </Carousel>
  )
}
