export type DocumentSource = {
  id: string
  title: string
  slug: string
  url: string
}

export const documentSources: DocumentSource[] = [
  {
    id: 'manifesto',
    title: 'Manifesto',
    slug: 'manifesto',
    url: 'https://raw.githubusercontent.com/VigoTech/documentos/master/manifiesto.md',
  },
  {
    id: 'codigo-conduta',
    title: 'Codigo de conducta',
    slug: 'codigo-conduta',
    url: 'https://raw.githubusercontent.com/VigoTech/documentos/master/codigodeconducta.md',
  },
  {
    id: 'condicions-entrada',
    title: 'Condicions de entrada',
    slug: 'condicions-entrada',
    url: 'https://raw.githubusercontent.com/VigoTech/documentos/master/condicionsentrada.md',
  },
  {
    id: 'codigo-conduta-slack',
    title: 'Codigo de conducta en Slack',
    slug: 'codigo-conduta-slack',
    url: 'https://raw.githubusercontent.com/VigoTech/documentos/master/conducta_slack.md',
  },
]
