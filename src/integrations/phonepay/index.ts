import { Env, StandardCheckoutClient } from '@phonepe-pg/pg-sdk-node'

import { env } from '#/env'

const CLIENT_ID = env.PHONEPAY_CLIENT_ID
const CLIENT_SECRET = env.PHONEPAY_CLIENT_SECRET
const CLIENT_VERSION = 1

const clientEnv = env.NODE_ENV === 'development' ? Env.SANDBOX : Env.PRODUCTION

export const paymentClient = StandardCheckoutClient.getInstance(
  CLIENT_ID,
  CLIENT_SECRET,
  CLIENT_VERSION,
  clientEnv,
)
