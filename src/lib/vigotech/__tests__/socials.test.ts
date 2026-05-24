import { describe, expect, it } from 'vitest'

import { getGroupSocialLinks } from '../socials'

describe('getGroupSocialLinks', () => {
  it('maps git repositories with a dedicated icon and label', () => {
    expect(
      getGroupSocialLinks({
        git: 'https://codeberg.org/GALPon',
      }),
    ).toEqual([
      {
        key: 'git',
        href: 'https://codeberg.org/GALPon',
        icon: 'lucide:git-branch',
        label: 'Repositorio',
      },
    ])
  })

  it('orders repository links before social networks', () => {
    expect(
      getGroupSocialLinks({
        twitter: 'https://twitter.com/python_vigo',
        git: 'https://github.com/python-vigo',
        web: 'https://www.python-vigo.es/',
      }).map((item) => item.key),
    ).toEqual(['web', 'git', 'twitter'])
  })
})
