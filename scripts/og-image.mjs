// Bakes the 1200x630 social preview (src/app/opengraph-image.png and twitter-image.png)
// from the dithered skyline still, so it matches the hero. No text: the embed's own
// title and description already say who this is. Run `node scripts/og-image.mjs`
// after re-baking public/skyline/charlotte-dither.png.
import { copyFile } from 'node:fs/promises'

import sharp from 'sharp'

const W = 1200
const H = 630
/** Whole-number zoom keeps every dither cell the same size (3px). */
const ZOOM = 3
/** Where the crop starts in the zoomed still; keeps the tall tower on the right. */
const LEFT = 600
const out = 'src/app/opengraph-image.png'

const credit = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <text x="${W - 20}" y="${H - 16}" text-anchor="end" font-family="Inter, sans-serif" font-size="14" fill="#a9b1d6" fill-opacity="0.75">Photo: Nan Palmero, CC BY 2.0</text>
</svg>`)

const still = sharp('public/skyline/charlotte-dither.png')
const { width, height } = await still.metadata()

await still
  .resize(width * ZOOM, height * ZOOM, { kernel: 'nearest' })
  .extract({ left: LEFT, top: 0, width: W, height: H })
  .composite([{ input: credit }])
  .png({ compressionLevel: 9 })
  .toFile(out)
await copyFile(out, 'src/app/twitter-image.png')
console.log('wrote', out)
