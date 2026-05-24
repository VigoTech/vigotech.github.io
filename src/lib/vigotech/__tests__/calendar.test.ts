import { describe, expect, it } from 'vitest'

import {
  getCalendarEventDisplayTitle,
  mergeCalendarEvents,
  type CalendarEvent,
} from '../calendar'

const baseEvent = {
  end: null,
  location: null,
  description: null,
  htmlLink: null,
  allDay: false,
} satisfies Omit<CalendarEvent, 'id' | 'title' | 'start'>

describe('getCalendarEventDisplayTitle', () => {
  it('prefixes the title with the community name when available', () => {
    expect(
      getCalendarEventDisplayTitle({
        title: 'Obradoiro aberto de IA',
        groupName: 'Python Vigo',
      }),
    ).toBe('Python Vigo: Obradoiro aberto de IA')
  })

  it('does not duplicate the community name when the title is already prefixed', () => {
    expect(
      getCalendarEventDisplayTitle({
        title: 'Python Vigo: Obradoiro aberto de IA',
        groupName: 'Python Vigo',
      }),
    ).toBe('Python Vigo: Obradoiro aberto de IA')
  })
})

describe('mergeCalendarEvents', () => {
  it('preserves the community name from content events when a google event matches by title', () => {
    const contentEvents: CalendarEvent[] = [
      {
        ...baseEvent,
        id: 'content-1',
        title: 'Obradoiro aberto de IA',
        start: '2026-04-16T17:00:00.000Z',
        groupName: 'Python Vigo',
      },
    ]
    const googleEvents: CalendarEvent[] = [
      {
        ...baseEvent,
        id: 'google-1',
        title: 'Obradoiro aberto de IA',
        start: '2026-04-16T19:00:00.000+02:00',
        location: 'A Industriosa',
      },
    ]

    expect(mergeCalendarEvents(contentEvents, googleEvents)).toEqual([
      {
        ...baseEvent,
        id: 'google-1',
        title: 'Obradoiro aberto de IA',
        displayTitle: 'Python Vigo: Obradoiro aberto de IA',
        start: '2026-04-16T19:00:00.000+02:00',
        location: 'A Industriosa',
        groupName: 'Python Vigo',
      },
    ])
  })
})
