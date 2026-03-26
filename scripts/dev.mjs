import { spawn } from 'node:child_process'

const args = process.argv.slice(2)
const withMockEvents = args.includes('--mockEvents')
const astroArgs = args.filter((arg) => arg !== '--mockEvents')

const child = spawn('pnpm', ['astro', 'dev', ...astroArgs], {
  stdio: 'inherit',
  env: {
    ...process.env,
    VIGOTECH_MOCK_EVENTS: withMockEvents ? 'true' : process.env.VIGOTECH_MOCK_EVENTS,
  },
})

child.on('exit', (code) => {
  process.exit(code ?? 0)
})
