import { absolute, site } from '@/config/site'
import { person } from '@/content'

const personId = absolute('/#person')

const sameAs = [
  person.links.github,
  person.links.linkedin,
  person.links.x,
  person.links.instagram,
]

const personNode = {
  '@type': 'Person',
  '@id': personId,
  name: person.name,
  alternateName: [person.alias, person.handle],
  url: site.url,
  email: person.email,
  description: site.description,
  image: absolute('/opengraph-image.png'),
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Charlotte',
    addressRegion: 'NC',
    addressCountry: 'US',
  },
  sameAs,
}

const websiteNode = {
  '@type': 'WebSite',
  '@id': absolute('/#website'),
  url: site.url,
  name: site.name,
  inLanguage: 'en-US',
  publisher: { '@id': personId },
}

export const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [personNode, websiteNode],
}

export const resumeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': absolute('/resume'),
  url: absolute('/resume'),
  name: `${person.name}: resume`,
  isPartOf: { '@id': absolute('/#website') },
  mainEntity: personNode,
}
