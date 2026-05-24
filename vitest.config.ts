/// <reference types='vitest/config' />
import { getViteConfig } from 'astro/config'

export default getViteConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
    exclude: ['playwright/**', 'node_modules/**', 'dist/**', '.astro/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 60,
        statements: 60,
        functions: 60,
        branches: 25,
      },
    },
  },
})
