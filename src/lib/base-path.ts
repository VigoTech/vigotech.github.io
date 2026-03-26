const normalizeConfiguredBase = (value: string | undefined): string => {
  const trimmed = value?.trim()

  if (!trimmed || trimmed === '/') {
    return '/'
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, '')}/`
}

export const BASE_PATH = normalizeConfiguredBase(import.meta.env.BASE_URL)

const BASE_PATH_PREFIX = BASE_PATH === '/' ? '' : BASE_PATH.slice(0, -1)

const isExternalPath = (value: string): boolean =>
  /^(?:[a-z]+:)?\/\//i.test(value) ||
  value.startsWith('mailto:') ||
  value.startsWith('tel:') ||
  value.startsWith('#')

export const withBase = (value: string): string => {
  if (!value || isExternalPath(value)) {
    return value
  }

  const normalizedPath = value === '/' ? '/' : `/${value.replace(/^\/+/, '')}`

  if (BASE_PATH === '/') {
    return normalizedPath
  }

  return normalizedPath === '/' ? BASE_PATH : `${BASE_PATH_PREFIX}${normalizedPath}`
}

export const stripBase = (value: string): string => {
  if (BASE_PATH === '/' || !value.startsWith(BASE_PATH_PREFIX)) {
    return value || '/'
  }

  const strippedPath = value.slice(BASE_PATH_PREFIX.length)
  return strippedPath || '/'
}
