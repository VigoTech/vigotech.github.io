import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { Events, Videos, Source } = require('metagroup-schema-tools')

const YOUTUBE_RECENT_VIDEOS_LIMIT = 50

const shouldSuppressLog = (args) => {
  const text = args
    .map((arg) => {
      if (arg instanceof Error) {
        return `${arg.name} ${arg.message}`
      }

      if (typeof arg === 'string') {
        return arg
      }

      if (arg && typeof arg === 'object' && 'message' in arg && typeof arg.message === 'string') {
        return String(arg.message)
      }

      return String(arg)
    })
    .join(' ')

  return (
    text.includes('Server responded to') ||
    text.includes("Method doesn't allow unregistered callers") ||
    text.includes('GaxiosError') ||
    text.includes('Status code 404') ||
    text.includes('INVALID_AUTH') ||
    text.includes('Not Found')
  )
}

const originalConsoleLog = console.log
const originalConsoleError = console.error

console.log = (...args) => {
  if (shouldSuppressLog(args)) {
    return
  }

  originalConsoleLog(...args)
}

console.error = (...args) => {
  if (shouldSuppressLog(args)) {
    return
  }

  originalConsoleError(...args)
}

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = resolve(rootDir, 'public')
const contentRootDir = resolve(rootDir, 'src/content')
const generatedVideosDir = resolve(contentRootDir, 'videos')
const generatedEventsDir = resolve(contentRootDir, 'events')

const sourceFile = process.env.VIGOTECH_MEMBERS_SOURCE_FILE ?? resolve(publicDir, 'vigotech.json')

const generatedFile =
  process.env.VIGOTECH_MEMBERS_SOURCE_GENERATED_FILE ??
  resolve(publicDir, 'vigotech-generated.json')

const schemaFile =
  process.env.VIGOTECH_MEMBERS_SCHEMA_FILE ?? resolve(publicDir, 'vigotech-schema.json')

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'))

const readJsonOrDefault = async (filePath, fallback) => {
  try {
    return await readJson(filePath)
  } catch {
    return fallback
  }
}

const toArray = (value) => {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

const warnFallback = (label, error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.warn(`[generate:data] ${label}: ${message}`)
}

const hasObjectValue = (value) => Boolean(value && typeof value === 'object')

const hasArrayItems = (value) => Array.isArray(value) && value.length > 0

const slugify = (value) =>
  String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const ensureDirectory = async (directoryPath) => {
  await mkdir(directoryPath, { recursive: true })
}

const safeYamlScalar = (value) => JSON.stringify(value ?? '')

const formatFrontmatterValue = (value, indent = 0) => {
  const prefix = ' '.repeat(indent)

  if (value === null) {
    return 'null'
  }

  if (typeof value === 'string') {
    return safeYamlScalar(value)
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]'
    }

    return value
      .map((item) => {
        if (item && typeof item === 'object') {
          const lines = formatFrontmatterValue(item, indent + 2).split('\n')
          return `${prefix}- ${lines[0]}${lines.length > 1 ? `\n${lines.slice(1).join('\n')}` : ''}`
        }

        return `${prefix}- ${formatFrontmatterValue(item, indent + 2)}`
      })
      .join('\n')
  }

  const entries = Object.entries(value)
  if (entries.length === 0) {
    return '{}'
  }

  return entries
    .map(([key, entryValue]) => {
      const formatted = formatFrontmatterValue(entryValue, indent + 2)
      const needsBlock =
        entryValue !== null &&
        typeof entryValue === 'object' &&
        !(Array.isArray(entryValue) && entryValue.length === 0)

      if (needsBlock) {
        return `${prefix}${key}:\n${formatted}`
      }

      return `${prefix}${key}: ${formatted}`
    })
    .join('\n')
}

const buildFrontmatterDocument = (data) => `---\n${formatFrontmatterValue(data)}\n---\n`

const getGroupName = (groupId, member) =>
  typeof member?.name === 'string' && member.name.trim() ? member.name : groupId

const getGroupLogo = (member) => (typeof member?.logo === 'string' ? member.logo : null)

const toContentSlug = (value, fallback) => {
  const slug = slugify(value)
  return slug || fallback
}

const writeIfChanged = async (filePath, content) => {
  try {
    const previous = await readFile(filePath, 'utf8')
    if (previous === content) {
      return false
    }
  } catch {
    // File does not exist yet.
  }

  await writeFile(filePath, content)
  return true
}

const getVideoId = (video) =>
  video && typeof video === 'object' && typeof video.id === 'string' && video.id.length > 0
    ? video.id
    : null

const combineVideoData = (current, incoming) => {
  if (!current) {
    return incoming
  }

  return {
    ...current,
    ...incoming,
    title: incoming.title ?? current.title,
    pubDate: incoming.pubDate ?? current.pubDate ?? null,
    thumbnails: incoming.thumbnails ?? current.thumbnails,
  }
}

const mergeVideoLists = (...lists) => {
  const orderedIds = []
  const videosById = new Map()
  const passthroughVideos = []

  for (const list of lists) {
    if (!Array.isArray(list)) {
      continue
    }

    for (const video of list) {
      const videoId = getVideoId(video)

      if (!videoId) {
        passthroughVideos.push(video)
        continue
      }

      if (!videosById.has(videoId)) {
        orderedIds.push(videoId)
      }

      videosById.set(videoId, combineVideoData(videosById.get(videoId), video))
    }
  }

  return [...orderedIds.map((videoId) => videosById.get(videoId)), ...passthroughVideos]
}

const sortVideosByDate = (videos) =>
  [...videos].sort((a, b) => {
    const aDate = typeof a?.pubDate === 'number' ? a.pubDate : -1
    const bDate = typeof b?.pubDate === 'number' ? b.pubDate : -1
    return bDate - aDate
  })

const dedupeEvents = (events) => {
  const orderedIds = []
  const eventsById = new Map()

  for (const event of events) {
    if (!event?.sourceId) {
      continue
    }

    if (!eventsById.has(event.sourceId)) {
      orderedIds.push(event.sourceId)
    }

    eventsById.set(event.sourceId, {
      ...eventsById.get(event.sourceId),
      ...event,
    })
  }

  return orderedIds.map((id) => eventsById.get(id))
}

const sortEventsByDate = (events) => [...events].sort((a, b) => a.date - b.date)

const getYoutubeUploadsPlaylistId = (channelId) => {
  if (typeof channelId !== 'string' || channelId.length < 3 || !channelId.startsWith('UC')) {
    return null
  }

  return `UU${channelId.slice(2)}`
}

const getYoutubeInitialData = async (url) => {
  const response = await fetch(url, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
      'accept-language': 'en-US,en;q=0.9',
    },
  })

  if (!response.ok) {
    throw new Error(`failed to fetch ${url}: ${response.status}`)
  }

  const html = await response.text()
  const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/s)

  if (!match) {
    throw new Error(`ytInitialData not found for ${url}`)
  }

  return JSON.parse(match[1])
}

const collectNodesByKey = (value, key, results = []) => {
  if (Array.isArray(value)) {
    value.forEach((item) => collectNodesByKey(item, key, results))
    return results
  }

  if (!value || typeof value !== 'object') {
    return results
  }

  if (key in value) {
    results.push(value[key])
  }

  Object.values(value).forEach((item) => collectNodesByKey(item, key, results))
  return results
}

const getRendererText = (value) => {
  if (!value) {
    return null
  }

  if (typeof value.simpleText === 'string') {
    return value.simpleText
  }

  if (Array.isArray(value.runs)) {
    return (
      value.runs
        .map((run) => run?.text ?? '')
        .join('')
        .trim() || null
    )
  }

  return null
}

const normalizeRendererThumbnails = (thumbnailList) => {
  if (!Array.isArray(thumbnailList) || thumbnailList.length === 0) {
    return undefined
  }

  const [defaultThumb, mediumThumb, highThumb, standardThumb = highThumb] = thumbnailList

  return {
    default: defaultThumb,
    medium: mediumThumb ?? defaultThumb,
    high: highThumb ?? mediumThumb ?? defaultThumb,
    standard: standardThumb ?? highThumb ?? mediumThumb ?? defaultThumb,
  }
}

const getYoutubeArchiveVideos = async (channelId) => {
  const playlistId = getYoutubeUploadsPlaylistId(channelId)
  if (!playlistId) {
    return []
  }

  const initialData = await getYoutubeInitialData(
    `https://www.youtube.com/playlist?list=${playlistId}`,
  )
  const renderers = collectNodesByKey(initialData, 'playlistVideoRenderer')

  return renderers
    .map((renderer) => {
      const videoId = typeof renderer?.videoId === 'string' ? renderer.videoId : null
      if (!videoId) {
        return null
      }

      return {
        player: 'youtube',
        id: videoId,
        title: getRendererText(renderer.title) ?? videoId,
        pubDate: null,
        thumbnails: normalizeRendererThumbnails(renderer.thumbnail?.thumbnails),
      }
    })
    .filter(Boolean)
}

const getNextEvent = (member, sources, fallback, label) => {
  const sourceList = toArray(sources)

  if (
    sourceList.some((source) => source?.type === 'eventbrite') &&
    !process.env.EVENTBRITE_OAUTH_TOKEN
  ) {
    if (hasObjectValue(fallback)) {
      warnFallback(`keeping previous nextEvent for ${label}`, 'missing EVENTBRITE_OAUTH_TOKEN')
      return fallback
    }

    return null
  }

  try {
    const nextEvents = Events.getGroupNextEvents(sourceList, {
      eventbriteToken: process.env.EVENTBRITE_OAUTH_TOKEN,
      member,
    })

    const nextEvent = Array.isArray(nextEvents) ? (nextEvents[0] ?? null) : (nextEvents ?? null)

    if (hasObjectValue(nextEvent)) {
      return nextEvent
    }

    if (hasObjectValue(fallback)) {
      warnFallback(`keeping previous nextEvent for ${label}`, 'no upcoming events fetched')
      return fallback
    }

    return null
  } catch (error) {
    warnFallback(`using previous nextEvent for ${label}`, error)
    return fallback ?? null
  }
}

const getHistoricalEvents = (member, sources, fallback, label) => {
  const sourceList = toArray(sources)
  const fallbackList = Array.isArray(fallback) ? fallback : []
  const allEvents = []

  for (const source of sourceList) {
    if (!source?.type) {
      continue
    }

    if (source.type === 'eventbrite' && !process.env.EVENTBRITE_OAUTH_TOKEN) {
      warnFallback(`keeping previous events for ${label}`, 'missing EVENTBRITE_OAUTH_TOKEN')
      continue
    }

    try {
      const nextEvents = toArray(
        Events.getNextFromSource(source, {
          eventbriteToken: process.env.EVENTBRITE_OAUTH_TOKEN,
          member,
        }),
      )
      const prevEvents = toArray(
        Events.getPrevFromSource(source, {
          eventbriteToken: process.env.EVENTBRITE_OAUTH_TOKEN,
          member,
        }),
      )

      allEvents.push(...nextEvents, ...prevEvents)
    } catch (error) {
      warnFallback(`using previous events for ${label}`, error)
    }
  }

  if (allEvents.length === 0 && fallbackList.length > 0) {
    return fallbackList
  }

  return dedupeEvents([...allEvents, ...fallbackList])
}

const getVideoList = async (member, sources, fallback, label) => {
  const sourceList = toArray(sources)

  try {
    const videoList = await Videos.getGroupVideos(sourceList, YOUTUBE_RECENT_VIDEOS_LIMIT, {
      youtubeApiKey: process.env.YOUTUBE_API_KEY,
      member,
    })

    const youtubeSources = sourceList.filter(
      (source) => source?.type === 'youtube' && source?.channel_id,
    )
    const youtubeArchiveLists = await Promise.all(
      youtubeSources.map(async (source) => {
        try {
          return await getYoutubeArchiveVideos(source.channel_id)
        } catch (error) {
          warnFallback(`using partial youtube archive for ${label}`, error)
          return []
        }
      }),
    )

    const mergedVideoList = sortVideosByDate(
      mergeVideoLists(...youtubeArchiveLists, videoList, fallback),
    )

    if (hasArrayItems(mergedVideoList)) {
      return mergedVideoList
    }

    if (hasArrayItems(fallback)) {
      warnFallback(`keeping previous videoList for ${label}`, 'no videos fetched')
      return fallback
    }

    return Array.isArray(videoList) ? videoList : (fallback ?? [])
  } catch (error) {
    warnFallback(`using previous videoList for ${label}`, error)
    return fallback ?? []
  }
}

const normalizeVideoEntry = (groupId, groupName, groupLogo, videoRaw, index) => {
  if (!videoRaw || typeof videoRaw !== 'object') {
    return null
  }

  const video = videoRaw
  const sourceId = (video.id ?? `${groupId}-${String(video.pubDate ?? index)}`).trim()
  if (!sourceId) {
    return null
  }

  const title = video.title ?? `${groupName} video ${index + 1}`
  const publishedAt =
    typeof video.pubDate === 'number'
      ? video.pubDate
      : typeof video.pubDate === 'string'
        ? Date.parse(video.pubDate)
        : null

  const thumbnails = video.thumbnails ?? {}
  const thumbnail =
    thumbnails.standard?.url ??
    thumbnails.high?.url ??
    thumbnails.medium?.url ??
    thumbnails.default?.url ??
    null

  const player = video.player ?? 'youtube'
  const url =
    player === 'youtube' ? `https://www.youtube.com/watch?v=${sourceId}` : (video.url ?? null)

  return {
    sourceId,
    groupId,
    groupName,
    groupLogo,
    title,
    player,
    url,
    publishedAt: Number.isFinite(publishedAt) ? publishedAt : null,
    thumbnail,
  }
}

const normalizeEventEntry = (groupId, groupName, groupLogo, eventRaw, index) => {
  if (!eventRaw || typeof eventRaw !== 'object') {
    return null
  }

  const title = eventRaw.title ?? eventRaw.name ?? `${groupName} event ${index + 1}`
  const date =
    typeof eventRaw.date === 'number'
      ? eventRaw.date
      : typeof eventRaw.date === 'string'
        ? Date.parse(eventRaw.date)
        : Number.NaN

  if (!Number.isFinite(date)) {
    return null
  }

  const sourceId =
    (eventRaw.sourceId ?? `${groupId}-${date}-${slugify(title)}`).trim() ||
    `${groupId}-${date}-${index}`

  return {
    sourceId,
    groupId,
    groupName,
    groupLogo,
    title,
    description: eventRaw.description ?? null,
    date,
    dateISO: new Date(date).toISOString(),
    location: eventRaw.location ?? null,
    link: eventRaw.link ?? eventRaw.url ?? null,
  }
}

const getPersistedEventsForMember = (groupId, member) => {
  const historical = Array.isArray(member.eventList) ? member.eventList : []

  if (historical.length > 0) {
    return historical
  }

  const nextEvent = member && typeof member === 'object' ? member.nextEvent : null

  return nextEvent
    ? [
        {
          ...nextEvent,
          sourceId: `${groupId}-${nextEvent.date ?? 'next'}-${slugify(nextEvent.title ?? 'event')}`,
        },
      ]
    : []
}

const writeVideoContentFiles = async (members) => {
  await ensureDirectory(generatedVideosDir)

  let writtenFiles = 0

  for (const [groupId, member] of Object.entries(members)) {
    const groupName = getGroupName(groupId, member)
    const groupLogo = getGroupLogo(member)
    const groupDir = resolve(generatedVideosDir, groupId)
    await ensureDirectory(groupDir)

    const rawList = Array.isArray(member.videoList) ? member.videoList : []
    for (const [index, videoRaw] of rawList.entries()) {
      const video = normalizeVideoEntry(groupId, groupName, groupLogo, videoRaw, index)
      if (!video) {
        continue
      }

      const filePath = resolve(
        groupDir,
        `${toContentSlug(video.sourceId, `${groupId}-${index + 1}`)}.md`,
      )
      writtenFiles += Number(await writeIfChanged(filePath, buildFrontmatterDocument(video)))
    }
  }

  return writtenFiles
}

const writeEventContentFiles = async (members, historicalEventsByGroup, rootEntry) => {
  await ensureDirectory(generatedEventsDir)

  let writtenFiles = 0

  if (rootEntry) {
    const rootDir = resolve(generatedEventsDir, 'root')
    await ensureDirectory(rootDir)
    const filePath = resolve(rootDir, `${toContentSlug(rootEntry.sourceId, 'root-next-event')}.md`)
    writtenFiles += Number(await writeIfChanged(filePath, buildFrontmatterDocument(rootEntry)))
  }

  for (const [groupId, member] of Object.entries(members)) {
    const groupName = getGroupName(groupId, member)
    const groupLogo = getGroupLogo(member)
    const groupDir = resolve(generatedEventsDir, groupId)
    await ensureDirectory(groupDir)

    const events =
      historicalEventsByGroup.get(groupId) ?? getPersistedEventsForMember(groupId, member)
    for (const [index, eventRaw] of events.entries()) {
      const event = normalizeEventEntry(groupId, groupName, groupLogo, eventRaw, index)
      if (!event) {
        continue
      }

      const filePath = resolve(
        groupDir,
        `${toContentSlug(event.sourceId, `${groupId}-${index + 1}`)}.md`,
      )
      writtenFiles += Number(await writeIfChanged(filePath, buildFrontmatterDocument(event)))
    }
  }

  return writtenFiles
}

const main = async () => {
  const [source, schema, previousGenerated] = await Promise.all([
    readJson(sourceFile),
    readJson(schemaFile),
    readJsonOrDefault(generatedFile, {}),
  ])

  const validation = Source.validate(source, schema)
  if (validation.errors.length > 0) {
    const details = validation.errors
      .map((error) => `${error.property} ${error.message}`.trim())
      .join('\n')
    throw new Error(`Invalid vigotech source data:\n${details}`)
  }

  const generated = structuredClone(source)
  generated.nextEvent = getNextEvent(
    generated,
    generated.events,
    previousGenerated.nextEvent ?? null,
    'root',
  )

  const members = generated.members ?? {}
  const previousMembers = previousGenerated.members ?? {}
  const historicalEventsByGroup = new Map()

  for (const [memberKey, memberValue] of Object.entries(members)) {
    if (!memberValue || typeof memberValue !== 'object') {
      continue
    }

    const member = memberValue
    const previousMember = previousMembers[memberKey] ?? {}
    member.nextEvent = getNextEvent(
      member,
      member.events,
      previousMember.nextEvent ?? null,
      memberKey,
    )
    member.videoList = await getVideoList(
      member,
      member.videos,
      previousMember.videoList ?? [],
      memberKey,
    )

    const historicalEvents = sortEventsByDate(
      getHistoricalEvents(member, member.events, previousMember.eventList ?? [], memberKey),
    )
    member.eventList = historicalEvents
    historicalEventsByGroup.set(memberKey, historicalEvents)
    if (historicalEvents.length === 0 && member.nextEvent) {
      historicalEventsByGroup.set(memberKey, getPersistedEventsForMember(memberKey, member))
    }
    generated.members[memberKey] = member
  }

  const rootEventEntry = normalizeEventEntry(
    'root',
    generated.name ?? 'VigoTech Alliance',
    generated.logo ?? null,
    generated.nextEvent,
    0,
  )
  const resolvedRootEventEntry =
    rootEventEntry ??
    (generated.nextEvent
      ? normalizeEventEntry(
          'root',
          generated.name ?? 'VigoTech Alliance',
          generated.logo ?? null,
          {
            ...generated.nextEvent,
            sourceId: `root-${generated.nextEvent.date ?? 'next'}-${slugify(generated.nextEvent.title ?? 'event')}`,
          },
          0,
        )
      : null)

  await ensureDirectory(contentRootDir)
  const [videoFilesWritten, eventFilesWritten] = await Promise.all([
    writeVideoContentFiles(members),
    writeEventContentFiles(members, historicalEventsByGroup, resolvedRootEventEntry),
  ])

  await writeFile(generatedFile, `${JSON.stringify(generated, null, 2)}\n`)
  console.log(`Generated ${generatedFile}`)
  console.log(`Generated ${videoFilesWritten} video content files in ${generatedVideosDir}`)
  console.log(`Generated ${eventFilesWritten} event content files in ${generatedEventsDir}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
