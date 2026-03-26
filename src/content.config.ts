import { glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'

import { documentSources } from './lib/vigotech/documents'
import { loadVigotechSources, slugify, toLocalGroupLogo } from './lib/vigotech/source'

const groups = defineCollection({
  loader: async () => {
    const { source, generated } = await loadVigotechSources()
    const sourceMembers = source.members ?? {}
    const generatedMembers = generated.members ?? {}
    const keys = new Set([...Object.keys(sourceMembers), ...Object.keys(generatedMembers)])

    return [...keys].map((key) => {
      const fromSource = sourceMembers[key] ?? {}
      const fromGenerated = generatedMembers[key] ?? {}
      const sourceLinks = (fromSource.links ?? {}) as Record<string, string>
      const generatedLinks = (fromGenerated.links ?? {}) as Record<string, string>
      const links = { ...sourceLinks, ...generatedLinks }
      const name =
        ((fromGenerated.name as string | undefined) ??
          (fromSource.name as string | undefined) ??
          key) ||
        key
      const videoList = fromGenerated.videoList
      const videoCount = Array.isArray(videoList)
        ? videoList.length
        : videoList && typeof videoList === 'object'
          ? Object.keys(videoList as Record<string, unknown>).length
          : 0
      return {
        id: key,
        key,
        slug: slugify(key),
        name,
        logo: toLocalGroupLogo(
          (fromGenerated.logo as string | undefined) ??
            (fromSource.logo as string | undefined) ??
            null,
        ),
        links,
        inactive:
          (fromSource.inactive as boolean | undefined) ??
          (fromGenerated.inactive as boolean | undefined) ??
          false,
        hasVideos: videoCount > 0,
        videoCount,
      }
    })
  },
  schema: z.object({
    key: z.string(),
    slug: z.string(),
    name: z.string(),
    logo: z.string().nullable(),
    links: z.record(z.string(), z.string()).default({}),
    inactive: z.boolean().default(false),
    hasVideos: z.boolean(),
    videoCount: z.number(),
  }),
})

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    sourceId: z.string(),
    groupId: z.string(),
    groupName: z.string(),
    groupLogo: z.string().nullable(),
    title: z.string(),
    description: z.string().nullable(),
    date: z.number(),
    dateISO: z.string(),
    location: z.string().nullable(),
    link: z.string().nullable(),
  }),
})

const videos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/videos' }),
  schema: z.object({
    sourceId: z.string(),
    groupId: z.string(),
    groupName: z.string(),
    groupLogo: z.string().nullable(),
    title: z.string(),
    player: z.string(),
    url: z.string().nullable(),
    publishedAt: z.number().nullable(),
    thumbnail: z.string().nullable(),
  }),
})

const friends = defineCollection({
  loader: async () => {
    const { friends } = await loadVigotechSources()

    if (Array.isArray(friends)) {
      return friends.map((item, index) => {
        const friend = item as Record<string, unknown>
        const name = (friend.name as string | undefined) ?? `Friend ${index + 1}`
        return {
          id: slugify(name) || `friend-${index + 1}`,
          name,
          logo: (friend.logo as string | undefined) ?? null,
          link: (friend.link as string | undefined) ?? (friend.web as string | undefined) ?? null,
        }
      })
    }

    return Object.entries(friends).map(([key, value]) => {
      const friend = (value ?? {}) as Record<string, unknown>
      const name = ((friend.name as string | undefined) ?? key) || key
      return {
        id: slugify(key) || key,
        name,
        logo: (friend.logo as string | undefined) ?? null,
        link: (friend.link as string | undefined) ?? (friend.web as string | undefined) ?? null,
      }
    })
  },
  schema: z.object({
    name: z.string(),
    logo: z.string().nullable(),
    link: z.string().nullable(),
  }),
})

const documents = defineCollection({
  loader: {
    name: 'vigotech-documents-loader',
    load: async ({ store, parseData, renderMarkdown }) => {
      store.clear()

      for (const document of documentSources) {
        let markdown = `# ${document.title}\n\nSource unavailable during build.`

        try {
          const response = await fetch(document.url)
          if (response.ok) {
            markdown = await response.text()
          }
        } catch {
          // Keep fallback content
        }

        const data = await parseData({
          id: document.id,
          data: {
            title: document.title,
            slug: document.slug,
            sourceUrl: document.url,
          },
        })

        store.set({
          id: document.id,
          data,
          rendered: await renderMarkdown(markdown),
        })
      }
    },
  },
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    sourceUrl: z.string().url(),
  }),
})

export const collections = {
  groups,
  events,
  videos,
  friends,
  documents,
}
