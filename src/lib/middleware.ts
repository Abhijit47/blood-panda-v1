import { createMiddleware } from '@tanstack/react-start'
import { ensureSession } from './auth.functions'

export const awesomeMiddleware = createMiddleware({ type: 'function' }).server(
  ({ next }) => {
    return next({
      context: {
        isAwesome: Math.random() > 0.5,
      },
    })
  },
)

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await ensureSession()

  return await next({
    context: { user: session.user },
  })
})

// Authorization (Middleware Factory) Example:
// type Permissions = Record<string, string[]>

// export function authorizationMiddleware(permissions: Permissions) {
//   return createMiddleware({ type: 'function' })
//     .middleware([authMiddleware])
//     .server(async ({ next, context }) => {
//       const granted = await auth.api.hasPermission(context.session, permissions)

//       if (!granted) {
//         throw new Error('Forbidden')
//       }

//       return await next()
//     })
// }

// type fn for serverFns
export const loggingMiddleware = createMiddleware({ type: 'function' })
  .client(({ next }) => {
    console.log('Client-side middleware executed')
    return next({
      sendContext: { some: 123 },
    })
  })
  .server(({ next }) => {
    console.log('Server-side middleware executed')
    return next({
      context: { some: 123 },
    })
  })
