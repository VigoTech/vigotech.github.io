import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

import type { CalendarEvent } from '../../lib/vigotech/calendar'
import {
  fetchGoogleCalendarEvents,
  getCalendarIcsUrl,
  mergeCalendarEvents,
} from '../../lib/vigotech/calendar'

const mapContentEvent = (
  entry: Awaited<ReturnType<typeof getCollection<'events'>>>[number],
): CalendarEvent => ({
  id: entry.data.sourceId,
  title: entry.data.title,
  start: entry.data.dateISO,
  end: null,
  location: entry.data.location,
  description: entry.data.description,
  htmlLink: entry.data.link,
  allDay: false,
  groupName: entry.data.groupName,
})

export const GET: APIRoute = async ({ request }) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const [{ events: googleEvents, source }, contentEntries] = await Promise.all([
      fetchGoogleCalendarEvents(controller.signal),
      getCollection('events'),
    ])

    const contentEvents = contentEntries.map(mapContentEvent)
    const events = mergeCalendarEvents(contentEvents, googleEvents)

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
