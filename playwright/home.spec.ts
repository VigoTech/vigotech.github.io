import { expect, test } from '@playwright/test'

test('homepage title renders', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Astro')
})
