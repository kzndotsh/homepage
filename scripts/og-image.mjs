// Bakes the 1200x630 social preview (src/app/opengraph-image.png and twitter-image.png)
// from the skyline photo. Run `node scripts/og-image.mjs` after changing the copy below.
import { copyFile } from 'node:fs/promises'

import sharp from 'sharp'

const W = 1200
const H = 630
const out = 'src/app/opengraph-image.png'

const text = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#16161e" stop-opacity="0.96"/>
      <stop offset="0.55" stop-color="#16161e" stop-opacity="0.7"/>
      <stop offset="1" stop-color="#16161e" stop-opacity="0.15"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fade)"/>
  <g font-family="Inter, sans-serif">
    <text x="80" y="300" font-size="92" font-weight="700" fill="#c0caf5">Logan Honeycutt</text>
    <text x="80" y="370" font-size="38" fill="#a9b1d6">Full-stack builder. Linux, self-hosting, open source.</text>
    <text x="80" y="530" font-size="34" font-weight="600" fill="#7aa2f7" font-family="JetBrains Mono, monospace">kzn.sh</text>
  </g>
  <text x="${W - 24}" y="${H - 20}" text-anchor="end" font-family="Inter, sans-serif" font-size="14" fill="#a9b1d6" fill-opacity="0.7">Photo: Nan Palmero, CC BY 2.0</text>
</svg>`)

await sharp('public/skyline/charlotte.webp')
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .composite([{ input: text }])
  .png({ compressionLevel: 9, palette: true })
  .toFile(out)
await copyFile(out, 'src/app/twitter-image.png')
console.log('wrote', out)
