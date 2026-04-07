// @ts-check
import { defineConfig } from 'astro/config'
import icon from 'astro-icon'

import tailwindcss from '@tailwindcss/vite'

/** @param {string | undefined} value */
const normalizeBase = (value) => {
  if (!value || value === '/') {
    return '/'
  }

  return `/${String(value).replace(/^\/+|\/+$/g, '')}/`
}

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://vigotech.org',
  base: normalizeBase(process.env.PUBLIC_BASE_PATH),
  integrations: [icon()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['shaders/core'],
    },
  },
})
