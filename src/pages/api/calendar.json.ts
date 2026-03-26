import type { APIRoute } from 'astro'

import { fetchGoogleCalendarEvents, getCalendarIcsUrl } from '../../lib/vigotech/calendar'

export const GET: APIRoute = async ({ request }) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const { events, source } = await fetchGoogleCalendarEvents(controller.signal)

    return new Response(
      JSON.stringify({
        source,
        events,
        icsUrl: getCalendarIcsUrl(),
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'public, max-age=300, s-maxage=300',
          vary: 'accept, origin',
          'x-request-url': request.url,
        },
      },
    )
  } finally {
    clearTimeout(timeout)
  }
}
