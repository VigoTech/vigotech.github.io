import { expect, test } from '@playwright/test'

test('calendar renders only events returned by the API', async ({ page }) => {
  const today = new Date()
  today.setHours(12, 0, 0, 0)

  await page.route('**/api/calendar.json', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json; charset=utf-8',
      body: JSON.stringify({
        source: 'test',
        events: [
          {
            id: 'test-event-1',
            title: 'Regression test event',
            start: today.toISOString(),
            end: null,
            location: 'Vigo',
            description: null,
            htmlLink: 'https://example.com/event',
            allDay: false,
          },
        ],
        icsUrl: 'https://example.com/calendar.ics',
      }),
    })
  })

  await page.goto('/')

  await expect(page.locator('[data-calendar-ics-link]')).toHaveAttribute(
    'href',
    'https://example.com/calendar.ics',
  )

  const dayEvents = page.locator('[data-calendar-day-events] article')
  await expect(dayEvents).toHaveCount(1)
  await expect(dayEvents).toContainText('Regression test event')

  await expect(page.getByText('Demo meetup frontend VigoTech')).toHaveCount(0)
  await expect(page.getByText('Obradoiro aberto de IA')).toHaveCount(0)
})
