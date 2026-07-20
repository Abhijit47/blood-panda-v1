import { createIsomorphicFn } from '@tanstack/react-start'
import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Different implementation per environment
export const getDeviceInfo = createIsomorphicFn()
  .server(() => ({ type: 'server', platform: process.platform }))
  .client(() => ({ type: 'client', userAgent: navigator.userAgent }))

// const storage = createIsomorphicFn()
//   .server((key: string) => {
//     // Server: File-based cache
//     const fs = require('node:fs')
//     return JSON.parse(fs.readFileSync('.cache', 'utf-8'))[key]
//   })
//   .client((key: string) => {
//     // Client: localStorage
//     return JSON.parse(localStorage.getItem(key) || 'null')
//   })
