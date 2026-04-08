import { chromium } from '@playwright/test'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 280, height: 844 } })
await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' })

const selectors = [
  'main[data-page-content]',
  'div.reveal.relative.overflow-hidden.bg-primary\\/70',
  'section.relative.mb-24.px-2.pt-20',
  '.vt-content-shell.grid.grid-cols-12.items-end.gap-8',
  'div.col-span-12.lg\\:col-span-7.pr-0.sm\\:pr-4',
  'div.relative.overflow-hidden.rounded-xl.px-4.py-8',
  'div.relative.z-10',
  'h1',
  'h1 + p',
]

const data = await page.evaluate((sel) => {
  return sel.map((s) => {
    const el = document.querySelector(s)
    if (el === null) {
      return { s, missing: true }
    }

    const r = el.getBoundingClientRect()
    return {
      s,
      left: r.left,
      right: r.right,
      width: r.width,
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      className: typeof el.className === 'string' ? el.className : '',
    }
  })
}, selectors)

console.log(JSON.stringify(data, null, 2))
await browser.close()
