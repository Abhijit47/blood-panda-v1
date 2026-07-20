import { env } from '#/env'
import { paymentClient } from '#/integrations/phonepay'
import type { PhonePeException } from '@phonepe-pg/pg-sdk-node'
import { CreateSdkOrderRequest, MetaInfo } from '@phonepe-pg/pg-sdk-node'
import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { ensureSession } from './auth.functions'
import { bookingFormSchema } from './validators/booking-schema'

const checkoutOrderPayload = z
  .object({
    bookingId: z.string(),
    totalPrice: z.number(),
  })
  .extend(bookingFormSchema.shape)

// type CheckoutOrderPayload = z.infer<typeof checkoutOrderPayload>

export const createCheckOut = createServerFn({ method: 'POST' })
  .validator(checkoutOrderPayload)
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const redirectUrl = env.BETTER_AUTH_URL

    const merchantOrderId = crypto.randomUUID()
    // const prefillUserLoginDetails =
    //   PrefillUserLoginDetails.builder().phoneNumber('')

    const metaInfo = MetaInfo.builder()
      .udf1(session.user.id)
      .udf2(data.bookingId)
      .udf3(data.memberDetails[0].name)
      .udf4(data.memberDetails[0].email)
      .udf5(data.memberDetails[0].phone)
      .udf6(data.totalPrice.toString())
      .udf7(data.address.location)
      .udf8(data.schedule.scheduleDate)
      .udf9(data.schedule.slotTime)
      .udf10(data.address.pincode)
      .build()

    // Amount in paise (100 = ₹1.00)
    const amountInPaisa = Math.round(data.totalPrice * 100)

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
      const result = await paymentClient.pay(orderRequest)
      throw redirect({
        href: result.redirectUrl,
      })
    } catch (error) {
      const err = error as PhonePeException
      console.log(err.message)
      throw new Error(
        `Failed to create checkout order: ${err.message || 'Internal Server Error'}`,
      )
    }
  })
