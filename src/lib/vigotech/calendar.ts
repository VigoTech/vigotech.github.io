export type CalendarEvent = {
  id: string
  title: string
  start: string
  end: string | null
  location: string | null
  description: string | null
  htmlLink: string | null
  allDay: boolean
}

type GoogleCalendarDate = {
  date?: string
  dateTime?: string
}

type GoogleCalendarItem = {
  id?: string
  summary?: string
  description?: string
  location?: string
  htmlLink?: string
  start?: GoogleCalendarDate
  end?: GoogleCalendarDate
}

const CALENDAR_ID = 'orestes.io_fj8ev1vakdnl8l8o6jeljhof1s@group.calendar.google.com'
const DEFAULT_MAX_RESULTS = 24

const getCalendarApiUrl = (): URL => {
  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`,
  )

  url.searchParams.set('singleEvents', 'true')
  url.searchParams.set('orderBy', 'startTime')
  url.searchParams.set('maxResults', String(DEFAULT_MAX_RESULTS))
  url.searchParams.set('timeMin', new Date().toISOString())

  return url
}

export const mapGoogleCalendarItem = (item: GoogleCalendarItem): CalendarEvent | null => {
  const title = item.summary?.trim()
  const startRaw = item.start?.dateTime ?? item.start?.date

  if (!title || !startRaw) {
    return null
  }

  const endRaw = item.end?.dateTime ?? item.end?.date ?? null
  const allDay = Boolean(item.start?.date && !item.start?.dateTime)

  return {
    id: item.id ?? `${title}-${startRaw}`,
    title,
    start: startRaw,
    end: endRaw,
    location: item.location?.trim() || null,
    description: item.description?.trim() || null,
    htmlLink: item.htmlLink ?? null,
    allDay,
  }
}

export const fetchGoogleCalendarEvents = async (
  signal?: AbortSignal,
): Promise<{ events: CalendarEvent[]; source: 'live' | 'fallback' }> => {
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY
  if (!apiKey) {
    return {
      events: [],
      source: 'fallback',
    }
  }

  const url = getCalendarApiUrl()
  url.searchParams.set('key', apiKey)

  try {
    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
      },
      signal,
    })

    if (!response.ok) {
      return { events: [], source: 'fallback' }
    }

    const payload = (await response.json()) as { items?: GoogleCalendarItem[] }
    const events = (payload.items ?? [])
      .map(mapGoogleCalendarItem)
      .filter((item): item is CalendarEvent => Boolean(item))

    return {
      events,
      source: 'live',
    }
  } catch {
    return {
      events: [],
      source: 'fallback',
    }
  }
}

export const getCalendarIcsUrl = (): string =>
  'https://calendar.google.com/calendar/ical/orestes.io_fj8ev1vakdnl8l8o6jeljhof1s%40group.calendar.google.com/public/basic.ics'
