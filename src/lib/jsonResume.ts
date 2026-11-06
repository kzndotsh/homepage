import {
  cv,
  earlierWork,
  education,
  experience,
  person,
  skills,
} from '@/content'
import { absolute } from '@/config/site'

/** "2023-2024" -> ["2023", "2024"]. */
const years = (range: string) => range.split('-')

/**
 * The CV in the JSON Resume format (https://jsonresume.org/schema), built from
 * src/content so it cannot drift from the site. The phone number is left off.
 */
export function jsonResume() {
  const [city, region] = person.city.split(', ')

  return {
    $schema:
      'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: person.name,
      label: cv.headline,
      email: person.email,
      url: absolute('/'),
      summary: cv.summary,
      location: { city, region, countryCode: 'US' },
      profiles: [
        {
          network: 'GitHub',
          username: 'kzndotsh',
          url: person.links.github,
        },
        {
          network: 'LinkedIn',
          username: 'kzndotsh',
          url: person.links.linkedin,
        },
        { network: 'X', username: 'kzndotsh', url: person.links.x },
        {
          network: 'Instagram',
          username: 'kzndotsh',
          url: person.links.instagram,
        },
        { network: 'Discord', username: person.discord },
      ],
    },
    work: [
      ...experience.map((r) => ({
        name: r.org,
        position: r.contract ? `${r.title} (contract)` : r.title,
        location: r.location,
        startDate: r.start,
        ...(r.end && { endDate: r.end }),
        highlights: r.bullets,
      })),
      {
        name: 'Earlier and other work',
        position: 'Founder, consultant and organiser',
        location: earlierWork.location,
        startDate: earlierWork.start,
        endDate: earlierWork.end,
        highlights: earlierWork.items.map(
          (i) => `${i.label} (${i.year}): ${i.text}`,
        ),
      },
    ],
    education: [
      {
        institution: education.school,
        area: education.program,
        startDate: years(education.years)[0],
        endDate: years(education.years)[1],
      },
    ],
    certificates: education.certifications.map((name) => ({ name })),
    skills: skills.map((g) => ({ name: g.label, keywords: g.items })),
    meta: {
      canonical: absolute('/api/v1/resume'),
      version: 'v1.0.0',
    },
  }
}
