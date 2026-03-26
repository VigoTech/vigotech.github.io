import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

type Json = Record<string, unknown>

const localConfigDataDir =
  process.env.VIGOTECH_CONFIG_DATA_DIR ?? fileURLToPath(new URL('../../../public', import.meta.url))

const generatedDataDir = process.env.VIGOTECH_GENERATED_DATA_DIR ?? localConfigDataDir

const readJson = async <T>(fileName: string, fallback: T, dataDir: string): Promise<T> => {
  try {
    const filePath = join(dataDir, fileName)
    const raw = await readFile(filePath, 'utf8')
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export type VigotechSource = {
  name?: string
  links?: Record<string, string>
  members?: Record<string, Json>
}

export type VigotechGenerated = {
  name?: string
  links?: Record<string, string>
  nextEvent?: Json
  members?: Record<string, Json>
}

export type VigotechSources = {
  source: VigotechSource
  generated: VigotechGenerated
  friends: Record<string, Json>
}

let cache: Promise<VigotechSources> | null = null

export const loadVigotechSources = (): Promise<VigotechSources> => {
  if (!cache) {
    cache = Promise.all([
      readJson<VigotechSource>('vigotech.json', {}, localConfigDataDir),
      readJson<VigotechGenerated>('vigotech-generated.json', {}, generatedDataDir),
      readJson<Record<string, Json>>('friends.json', {}, localConfigDataDir),
    ]).then(([source, generated, friends]) => ({
      source,
      generated,
      friends,
    }))
  }

  return cache
}

export const slugify = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const toLocalGroupLogo = (logo: string | null | undefined): string | null => {
  if (!logo) {
    return null
  }

  if (logo.startsWith('/images/groups/')) {
    return logo
  }

  const fromUrl = logo.match(/\/images\/([^/?#]+)$/i)?.[1]
  if (fromUrl) {
    return `/images/groups/${fromUrl}`
  }

  return logo
}
