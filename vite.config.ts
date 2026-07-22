import { devtools } from '@tanstack/devtools-vite'
import { defineConfig, loadEnv } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import contentCollections from '@content-collections/vite'

import netlify from '@netlify/vite-plugin-tanstack-start'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import { boneyardPlugin } from 'boneyard-js/vite'
import { nitro } from 'nitro/vite'
import path from 'node:path'
import neon from './neon-vite-plugin.ts'

const env = loadEnv('dev', process.cwd(), '')

const isDev = env['NODE_ENV'] === 'development'

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      // Force Vite to bypass the broken relative entry point
      '@liorpo/react-hook-form-persist': path.resolve(
        __dirname,
        'node_modules/@liorpo/react-hook-form-persist/dist/index.js',
      ),
    },
  },
  plugins: [
    boneyardPlugin({
      framework: 'react',
      routes: [
        '/packages/gold',
        '/packages/diamond',
        '/packages/silver',
        '/packages/platinum',
        '/packages/signature',
      ],
      debug: isDev,
    }),
    contentCollections(),
    devtools(),
    netlify(),
    neon,
    tailwindcss(),
    tanstackStart(),
    nitro(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  optimizeDeps: {
    include: ['swiper', 'swiper/react', 'swiper/modules'],
  },
})

export default config
