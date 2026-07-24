import { capitalizeFirstLetter, formatSlug } from '#/lib/utils'
import type { FileRouteTypes } from '#/routeTree.gen'

const BASE_URL = import.meta.env.VITE_BETTER_AUTH_URL as string

type Path = FileRouteTypes['fullPaths']

export function seo(path: Path, slug?: string) {
  const titlePath =
    path === '/' ? 'Home' : `${capitalizeFirstLetter(path.split('/')[1])}`

  return {
    meta: [
      {
        title: `Blood Tests & Lab Tests in Bengaluru | BloodPanda - ${titlePath} ${slug ? `| ${formatSlug(slug)}` : ''}`,
      },
      {
        name: 'description',
        content:
          'Book home blood tests in Bengaluru with BloodPanda. NABL-accredited partner labs, doorstep sample collection, affordable health packages, and fast, accurate reports online.',
      },
      {
        name: 'keywords',
        content:
          'BloodPanda, BloodPanda Diagnostics, Blood Test, Home Blood Test, Home Sample Collection, Diagnostic Lab, Health Checkup, Full Body Checkup, Lab Tests, Blood Tests, NABL Lab, Medical Laboratory, Preventive Health Checkup, Diagnostic Services, Home Diagnostics, Online Blood Test Booking, Bengaluru Diagnostics, Bangalore Blood Tests, Affordable Health Packages, Accurate Test Results, Health Screening, Lab Test Packages, Blood Test at Home, Medical Testing Services, Health Monitoring, Wellness Checkup, Blood Test Reports Online, Home Health Services, Diagnostic Testing in Bengaluru',
      },
      // Open Graph
      {
        property: 'og:title',
        content:
          'Blood Tests & Lab Tests in Bengaluru | Home Sample Collection | BloodPanda',
      },
      {
        property: 'og:description',
        content:
          'Book home blood tests in Bengaluru with BloodPanda. NABL-accredited partner labs, doorstep sample collection, affordable health packages, and fast, accurate reports online.',
      },
      { property: 'og:image', content: '/packages/packages-bg.png' },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: `${BASE_URL}${path}` },
      // Twitter Card
      {
        name: 'twitter:card',
        content:
          'Blood Tests & Lab Tests in Bengaluru | Home Sample Collection | BloodPanda',
      },
      { name: 'twitter:url', content: `${BASE_URL}${path}` },
      {
        name: 'twitter:title',
        content:
          'Book home blood tests in Bengaluru with BloodPanda. NABL-accredited partner labs, doorstep sample collection, affordable health packages, and fast, accurate reports online.',
      },
      {
        name: 'twitter:description',
        content:
          'BloodPanda offers doorstep blood sample collection, health checkups, and diagnostic tests through trusted NABL-accredited partner labs across Bengaluru.',
      },
      {
        name: 'twitter:image',
        content: '/packages/packages-bg.png',
      },
    ],
    links: [
      {
        rel: 'canonical',
        // href: BASE_URL,
        // heref: `${BASE_URL}${path}`,
        heref: slug ? `${BASE_URL}${path}/${slug}` : `${BASE_URL}${path}`,
        // href: `https://myapp.com/posts/${params.postId}`,
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicons/favicon-16x16.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicons/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '64x64',
        href: '/favicons/favicon-64x64.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '128x128',
        href: '/favicons/favicon-128x128.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '256x256',
        href: '/favicons/favicon-256x256.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicons/apple-touch-icon.png',
      },
      {
        name: 'msapplication-TileImage',
        content: '/favicons/mstile-144x144.png',
      },
      {
        rel: 'shortcut icon',
        href: '/favicons/favicon.ico',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  }
}
