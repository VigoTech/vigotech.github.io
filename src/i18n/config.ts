export const LANG = 'gl' as const

export const LOCALE_BY_LANG = {
  gl: 'gl-ES',
} as const

export type Lang = keyof typeof LOCALE_BY_LANG

export const LOCALE = LOCALE_BY_LANG[LANG]
