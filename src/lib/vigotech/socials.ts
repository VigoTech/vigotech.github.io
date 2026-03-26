export type GroupLinkIcon = {
  key: string
  icon: string
  label: string
}

const SOCIAL_ICON_MAP: Record<string, GroupLinkIcon> = {
  web: { key: 'web', icon: 'lucide:globe', label: 'Web' },
  website: { key: 'website', icon: 'lucide:globe', label: 'Web' },
  home: { key: 'home', icon: 'lucide:house', label: 'Inicio' },
  github: { key: 'github', icon: 'lucide:github', label: 'GitHub' },
  twitter: { key: 'twitter', icon: 'lucide:twitter', label: 'Twitter' },
  x: { key: 'x', icon: 'lucide:twitter', label: 'X' },
  linkedin: { key: 'linkedin', icon: 'lucide:linkedin', label: 'LinkedIn' },
  youtube: { key: 'youtube', icon: 'lucide:youtube', label: 'YouTube' },
  instagram: { key: 'instagram', icon: 'lucide:instagram', label: 'Instagram' },
  telegram: { key: 'telegram', icon: 'lucide:send', label: 'Telegram' },
  meetup: { key: 'meetup', icon: 'lucide:users', label: 'Meetup' },
  discord: { key: 'discord', icon: 'lucide:message-circle', label: 'Discord' },
  twitch: { key: 'twitch', icon: 'lucide:tv', label: 'Twitch' },
  slack: { key: 'slack', icon: 'lucide:messages-square', label: 'Slack' },
  facebook: { key: 'facebook', icon: 'lucide:facebook', label: 'Facebook' },
  tiktok: { key: 'tiktok', icon: 'lucide:music-2', label: 'TikTok' },
  mastodon: { key: 'mastodon', icon: 'lucide:radio', label: 'Mastodon' },
  ivoox: { key: 'ivoox', icon: 'lucide:podcast', label: 'iVoox' },
  maillist: { key: 'maillist', icon: 'lucide:list', label: 'Lista correo' },
  spotify: { key: 'spotify', icon: 'lucide:music-3', label: 'Spotify' },
  mail: { key: 'mail', icon: 'lucide:mail', label: 'Email' },
}

const LINK_PRIORITY = [
  'web',
  'website',
  'meetup',
  'github',
  'twitter',
  'x',
  'linkedin',
  'youtube',
  'instagram',
  'telegram',
  'discord',
  'twitch',
  'slack',
  'facebook',
  'mastodon',
  'ivoox',
  'maillist',
  'mail',
  'spotify',
  'tiktok',
]

const UNKNOWN_LINK_ICON: GroupLinkIcon = {
  key: 'link',
  icon: 'lucide:link',
  label: 'Ligazon',
}

const normalizeLinkKey = (key: string): string => key.trim().toLowerCase()

export const getGroupSocialLinks = (
  links: Record<string, string>,
  limit?: number,
): Array<{ key: string; href: string; icon: string; label: string }> => {
  const normalized = Object.entries(links)
    .filter(([, href]) => typeof href === 'string' && href.length > 0)
    .map(([key, href]) => ({
      key,
      normalizedKey: normalizeLinkKey(key),
      href,
    }))

  const rank = (normalizedKey: string): number => {
    const index = LINK_PRIORITY.indexOf(normalizedKey)
    return index === -1 ? Number.MAX_SAFE_INTEGER : index
  }

  const sorted = normalized.sort((a, b) => {
    const rankDiff = rank(a.normalizedKey) - rank(b.normalizedKey)
    return rankDiff !== 0 ? rankDiff : a.key.localeCompare(b.key, 'gl')
  })

  const selected = typeof limit === 'number' ? sorted.slice(0, limit) : sorted

  return selected.map(({ key, normalizedKey, href }) => {
    const meta = SOCIAL_ICON_MAP[normalizedKey] ?? {
      ...UNKNOWN_LINK_ICON,
      label: key,
    }
    return {
      key,
      href,
      icon: meta.icon,
      label: meta.label,
    }
  })
}
