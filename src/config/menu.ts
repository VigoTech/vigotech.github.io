export type MenuItem = {
  id: 'groups' | 'videos' | 'about' | 'home'
  url: string
}

export const menuItems: MenuItem[] = [
  { id: 'home', url: '/' },
  { id: 'groups', url: '/groups' },
  { id: 'videos', url: '/videos' },
  { id: 'about', url: '/manifesto' },
]
