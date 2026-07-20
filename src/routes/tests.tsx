import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '#/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Skeleton } from '#/components/ui/skeleton'
import { Spinner } from '#/components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import {
  getPrimaryCategoryList,
  loadTestsBasedOnSearch,
  secondaryCategoryList,
} from '#/lib/tests.functions'
import { formatCurrency, formattedCategoryName } from '#/lib/utils'
import { selectCategorySchema } from '#/lib/validators/tests-schema'
import { useCart } from '#/stores/useCart'
import { IconBasket } from '@tabler/icons-react'
import {
  Await,
  createFileRoute,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { XCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export const Route = createFileRoute('/tests')({
  validateSearch: selectCategorySchema,
  // Declare which search params the loader depends on
  loaderDeps: ({ search: { primary, secondary, q } }) => ({
    primary,
    secondary,
    q,
  }),
  loader: async ({ deps: { primary, secondary, q } }) => {
    const primaryCategories = await getPrimaryCategoryList()
    const secondaryCategories = secondaryCategoryList()

    const primaryCategoryExists = primaryCategories.some(
      (category) => category.value === primary,
    )
    if (primary && !primaryCategoryExists) {
      throw new Error(`Invalid primary category: ${primary}`)
    }

    const secondaryCategoryExists = await secondaryCategories.then(
      (categories) =>
        categories.some((category) => category.value === secondary),
    )
    if (secondary && !secondaryCategoryExists) {
      throw new Error(`Invalid secondary category: ${secondary}`)
    }

    const loadedTests = loadTestsBasedOnSearch({
      data: {
        primary,
        secondary,
        q,
      },
    })

    return {
      primaryCategories,
      deferredPromise: secondaryCategories,
      deferredTests: loadedTests,
    }
  },
  component: RouteComponent,
  errorComponent: ({ error }) => ErrorComponent({ error }),
  notFoundComponent: NotFoundComponent,
  pendingComponent: PendingComponent,
})

function RouteComponent() {
  const { primary, secondary, q } = Route.useSearch()
  const [query, setQuery] = useState(q || '')

  const { addItem } = useCart()

  const { primaryCategories, deferredPromise, deferredTests } =
    Route.useLoaderData()

  const navigate = useNavigate({ from: Route.fullPath })

  const handlePrimaryChange = (e: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        primary: e,
        q: undefined,
        secondary: undefined,
      }),
      resetScroll: false,
    })
  }

  const handleSecondaryChange = (e: string) => {
    navigate({
      search: (prev) => ({ ...prev, secondary: e, q: undefined }),
      resetScroll: false,
    })
  }

  const handleResetSearch = () => {
    setQuery('')
    navigate({ search: {}, resetScroll: false })
  }

  // Debounce callback
  const debounced = useDebouncedCallback(
    // function
    (val) => {
      setQuery(val)
      navigate({
        search: (prev) => ({
          ...prev,
          primary: undefined,
          secondary: undefined,
          q: val || undefined, // if bouncedQuery is empty string then set it to undefined
        }),
      })
    },
    // delay in ms
    300,
  )

  // approach 1: useAwaited
  // const data = useAwaited({ promise: deferredPromise })

  const findPrimaryCategoryName = (primaryId: string) => {
    const result = primaryCategories.find(
      (category) => category.value === primaryId,
    )
    // return category ? category.label : 'health_checks_essential_tests'
    return result ? result.label : ''
  }

  return (
    <main className={'mx-auto max-w-(--breakpoint-xl) space-y-8 px-4 py-12'}>
      <section className={''}>
        <div
          className={
            'relative aspect-square h-full w-full sm:aspect-video md:aspect-video lg:aspect-26/9'
          }
        >
          <img
            src="/packages/packages-bg.png"
            alt="packages-bg"
            width={'100%'}
            height={'100%'}
            className={'absolute top-0 left-0 -z-10 h-full w-full object-cover'}
          />
          <div
            className={
              'flex h-full w-full max-w-lg flex-col items-start justify-center gap-4 px-4 md:px-8 lg:px-12'
            }
          >
            <h1 className={'text-4xl font-bold text-primary'}>
              Blood Test at Home in Bangalore
            </h1>
            <p className={'text-lg text-muted-foreground'}>
              With Blood Panda, book a blood or urine lab test at home & get the
              fastest blood sample collection from home from a Certified lab
              near you in Bangalore.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-sm gap-6">
        <InputGroup>
          <InputGroupInput
            placeholder="Type to search..."
            value={query || ''}
            onChange={(e) => debounced(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton variant="secondary">Search</InputGroupButton>

            {q && q.length > 0 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size={'xs'}
                    className={'size-6'}
                    onClick={() => handleResetSearch()}
                  >
                    <XCircleIcon className={'size-4'} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear</p>
                </TooltipContent>
              </Tooltip>
            ) : null}
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className={'grid grid-cols-3 gap-4'}>
        <div>
          <Select
            value={primary || '754513c0-4454-4fa0-83fc-c31bfd3c0e17'}
            onValueChange={(e) => handlePrimaryChange(e)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent position="popper" popover="hint">
              <SelectGroup>
                <SelectLabel>Primary Category (Main category)</SelectLabel>
                {primaryCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {formattedCategoryName(category.label)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Await
            promise={deferredPromise}
            fallback={<Skeleton className={'h-10 w-full'} />}
          >
            {(data) => {
              return (
                <Select
                  value={secondary || 'd5ac78e9-9937-489b-ac13-4f3a4692386b'}
                  onValueChange={(e) => handleSecondaryChange(e)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a sub category" />
                  </SelectTrigger>
                  <SelectContent position="popper" popover="hint">
                    <SelectGroup>
                      <SelectLabel>
                        Secondary Category (Sub-category)
                      </SelectLabel>
                      {data.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {formattedCategoryName(category.label)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )
            }}
          </Await>
        </div>
        <div>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose order" />
            </SelectTrigger>
            <SelectContent position="popper" popover="hint">
              <SelectGroup>
                <SelectLabel>Choose order</SelectLabel>
                <SelectItem value="asc">Ascending (A-Z)</SelectItem>
                <SelectItem value="desc">Descending (Z-A)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <h2 className={'text-3xl font-semibold'}>
        {formattedCategoryName(
          findPrimaryCategoryName(
            primary || '754513c0-4454-4fa0-83fc-c31bfd3c0e17',
          ),
        )}
      </h2>

      <div>
        <Await
          promise={deferredTests}
          fallback={
            <div className={'h-72 w-full flex items-center justify-center'}>
              <Spinner className={'size-6'} />
            </div>
          }
        >
          {(data) => {
            return (
              <div className={''}>
                {data.length <= 0 ? (
                  <p className={'text-lg font-semibold text-center'}>
                    No tests found for the selected categories. Please select
                    different categories to see available tests.
                  </p>
                ) : (
                  <div
                    className={
                      'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                    }
                  >
                    {data.map((test) => (
                      <Card key={test.id} className={'py-0'}>
                        <CardHeader
                          className={'h-18 bg-primary py-2 text-accent'}
                        >
                          <CardTitle>
                            <h4 className={'text-sm'}>{test.name}</h4>
                          </CardTitle>
                        </CardHeader>

                        <CardContent className={'space-x-3'}>
                          <span className="text-muted-foreground line-through">
                            {formatCurrency(test.originalPrice)}
                          </span>{' '}
                          <span className="text-xl font-bold text-primary">
                            {formatCurrency(test.discountedPrice)}
                          </span>
                        </CardContent>

                        <CardFooter className={'py-4'}>
                          <Button
                            className={'w-full'}
                            type="button"
                            onClick={() =>
                              addItem({
                                item: {
                                  id: test.id,
                                  name: test.name,
                                  price: Number(test.discountedPrice),
                                  quantity: 1,
                                  image: 'https://avatar.vercel.sh/rauchg.png',
                                },
                              })
                            }
                          >
                            Add to cart
                            <IconBasket className="size-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )
          }}
        </Await>
      </div>
    </main>
  )

  // return (
  //   <main className={'mx-auto max-w-(--breakpoint-lg) space-y-8 px-4 py-12'}>
  //     Hello "/tests"!
  //     <Button variant={'destructive'}>
  //       <span onClick={handleResetSearch}>Reset Search</span>
  //     </Button>
  //     <div>
  //       <input
  //         type="text"
  //         value={query || ''}
  //         onChange={(e) => debounced(e.target.value)}
  //         placeholder="Search by name..."
  //       />
  //     </div>
  //     <div className={'grid grid-cols-2 gap-2'}>
  //       <div className={'flex flex-col gap-1'}>
  //         <label htmlFor="primary">Primary</label>
  //         <select
  //           name="primary"
  //           id="primary"
  //           value={primary || '754513c0-4454-4fa0-83fc-c31bfd3c0e17'}
  //           onChange={(e) => handlePrimaryChange(e)}
  //         >
  //           {primaryCategories.map((category) => (
  //             <option key={category.value} value={category.value}>
  //               {category.label}
  //             </option>
  //           ))}
  //         </select>
  //       </div>

  //       {/* Approach 2 */}
  //       <Await promise={deferredPromise} fallback={<div>Loading...</div>}>
  //         {(data) => {
  //           return (
  //             <div className={'flex flex-col gap-1'}>
  //               <label htmlFor="secondary">Secondary</label>
  //               <select
  //                 name="secondary"
  //                 id="secondary"
  //                 value={secondary || 'd5ac78e9-9937-489b-ac13-4f3a4692386b'}
  //                 onChange={(e) => handleSecondaryChange(e)}
  //               >
  //                 {data.map((category) => (
  //                   <option key={category.value} value={category.value}>
  //                     {category.label}
  //                   </option>
  //                 ))}
  //               </select>
  //             </div>
  //           )
  //         }}
  //       </Await>
  //     </div>
  //     <div>
  //       <Await promise={deferredTests} fallback={<div>Loading Tests...</div>}>
  //         {(data) => {
  //           return (
  //             <div className={''}>
  //               {data.length <= 0 ? (
  //                 <p>
  //                   No tests found for the selected categories. Please select
  //                   different categories to see available tests.
  //                 </p>
  //               ) : (
  //                 <>
  //                   {data.map((test) => (
  //                     <div key={test.id} className={'border p-2 my-2'}>
  //                       <h3>{test.name}</h3>
  //                       <p>Price: {test.discountedPrice}</p>
  //                       <p>Primary Category ID: {test.primaryCategoryId}</p>
  //                       <p>Secondary Category ID: {test.secondaryCategoryId}</p>
  //                     </div>
  //                   ))}
  //                 </>
  //               )}
  //             </div>
  //           )
  //         }}
  //       </Await>
  //     </div>
  //   </main>
  // )
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
