import { getPaymentClient } from '#/integrations/phonepay'
import type { PhonePeException } from '@phonepe-pg/pg-sdk-node'
import { CreateSdkOrderRequest, MetaInfo } from '@phonepe-pg/pg-sdk-node'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createMiddleware, createServerFn } from '@tanstack/react-start'

const loggingMiddleware = createMiddleware({ type: 'function' })
  .client(({ next }) => {
    console.log('Client-side middleware executed')
    return next()
  })
  .server(({ next }) => {
    console.log('Server-side middleware executed')
    return next()
  })

export const checkoutUser = createServerFn({ method: 'POST' })
  .middleware([loggingMiddleware])
  .handler(async () => {
    const redirectUrl = process.env.BETTER_AUTH_URL

    if (!redirectUrl) {
      throw new Error('Missing redirect URL')
    }

    const merchantOrderId = crypto.randomUUID()
    // const prefillUserLoginDetails =
    //   PrefillUserLoginDetails.builder().phoneNumber('')

    const metaInfo = MetaInfo.builder()
      .udf1('rand123')
      .udf2('somebookingId')
      .udf3('jhondeo')
      .udf4('email')
      .udf5('9999911111')
      .udf6('123')
      .udf7('nyc')
      .udf8('26-04-2024')
      .udf9('12:00 PM')
      .udf10('08:00 PM')
      .build()

    // Amount in paise (100 = ₹1.00)
    const amountInPaisa = Math.round(500 * 100)

    const orderRequest = CreateSdkOrderRequest.StandardCheckoutBuilder()
      .merchantOrderId(merchantOrderId)
      .amount(amountInPaisa)
      // .prefillUserLoginDetails(prefillUserLoginDetails)
      .metaInfo(metaInfo)
      .redirectUrl(`${redirectUrl}/booking-success`)
      .expireAfter(3600) // Expire after 1 hour
      .message('Message that will be shown for UPI collect transaction') // TODO: Add a proper message here
      .build()

    try {
      const result = await getPaymentClient().pay(orderRequest)
      throw redirect({
        href: result.redirectUrl,
      })
    } catch (error) {
      const err = error as PhonePeException
      console.log(err.message)
      // throw new Error(
      //   `Failed to create checkout order: ${err.message || 'Internal Server Error'}`,
      // )
      return false
    }
  })

export const Route = createFileRoute('/api/payment/callback')({
  server: {
    handlers: {
      GET: () => {
        return new Response('GET REQUEST NOT ALLOWED', { status: 200 })
      },
      POST: async ({ request }) => {
        const headers = request.headers
        const body = await request.text()

        const authorizationHeader = headers.get('authorization')

        console.log('Authorization Header:', authorizationHeader)
        console.log('Request Body:', body)

        return new Response('OK', { status: 200 })
      },
    },
  },
})
