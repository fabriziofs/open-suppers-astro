// @ts-check
import { defineConfig } from 'astro/config'

import tailwind from '@astrojs/tailwind'

import vue from '@astrojs/vue'

import vercel from '@astrojs/vercel/serverless'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [tailwind(), vue()],
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    }
  })
})
