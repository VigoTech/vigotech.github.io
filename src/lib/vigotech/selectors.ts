import type { CollectionEntry } from 'astro:content'

type VideoEntry = CollectionEntry<'videos'>
type EventEntry = CollectionEntry<'events'>
type GroupEntry = CollectionEntry<'groups'>

export const sortVideosByDate = (videos: VideoEntry[]): VideoEntry[] =>
  [...videos].sort((a, b) => {
    const aDate = a.data.publishedAt ?? 0
    const bDate = b.data.publishedAt ?? 0
    return bDate - aDate
  })

export const getRecentVideos = (videos: VideoEntry[], amount = 4): VideoEntry[] =>
  sortVideosByDate(videos).slice(0, amount)

export const getUpcomingEvents = (events: EventEntry[], amount = 3): EventEntry[] => {
  const now = Date.now()
  const upcoming = [...events]
    .filter((event) => event.data.date >= now)
    .sort((a, b) => a.data.date - b.data.date)

  return upcoming.slice(0, amount)
}

export const getTopGroupsByLastEvent = (
  groups: GroupEntry[],
  events: EventEntry[],
  amount = 3,
): GroupEntry[] => {
  const lastEventByGroup = new Map<string, number>()

  for (const event of events) {
    const prev = lastEventByGroup.get(event.data.groupId) ?? 0
    if (event.data.date > prev) {
      lastEventByGroup.set(event.data.groupId, event.data.date)
    }
  }

  return [...groups]
    .sort((a, b) => {
      const aDate = lastEventByGroup.get(a.id) ?? 0
      const bDate = lastEventByGroup.get(b.id) ?? 0
      return bDate - aDate
    })
    .slice(0, amount)
}
