// Bakes the skyline still (public/skyline/charlotte-dither.png) from the real
// canvas, so the still and the live WebGL output are the same pixels.
//
// It opens the running dev server in headless Chromium at a wide desktop size,
// waits for the hero canvas to draw, grabs exactly the canvas pixels, and keeps
// one pixel per 2px dither cell. Re-run after changing the shader, the palette
// or the hero's height:
//
//   npm run dev                      # in another terminal
//   node scripts/skyline-placeholder.mjs [url]   # default http://127.0.0.1:3001
//
//   node scripts/skyline-placeholder.mjs --mobile   # the phone band -> charlotte-dither-mobile.png
//
// CHROME=/path/to/chromium overrides the browser; it defaults to `chromium`.
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import sharp from 'sharp'

const MOBILE = process.argv.includes('--mobile')
const URL_ =
  process.argv.slice(2).find((a) => !a.startsWith('--')) ??
  'http://127.0.0.1:3001/'
const OUT = MOBILE
  ? 'public/skyline/charlotte-dither-mobile.png'
  : 'public/skyline/charlotte-dither.png'
const PIXEL = 2
const PORT = 9373
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const profile = mkdtempSync(join(tmpdir(), 'skyline-bake-'))
const chrome = spawn(
  process.env.CHROME ?? 'chromium',
  [
    '--headless=new',
    '--no-sandbox',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

try {
  let tabs
  for (let i = 0; i < 40 && !tabs; i++) {
    await sleep(250)
    tabs = await fetch(`http://127.0.0.1:${PORT}/json`)
      .then((r) => r.json())
      .catch(() => null)
  }
  const ws = new WebSocket(
    tabs.find((t) => t.type === 'page').webSocketDebuggerUrl,
  )
  await new Promise((r) => (ws.onopen = r))
  let id = 0
  const pending = {}
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data)
    if (m.id && pending[m.id]) pending[m.id](m)
  }
  const send = (method, params = {}) =>
    new Promise((r) => {
      pending[++id] = r
      ws.send(JSON.stringify({ id, method, params }))
    })
  const run = async (expression) =>
    (
      await send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true,
      })
    ).result.result.value

  await send('Emulation.setDeviceMetricsOverride', {
    width: MOBILE ? 390 : 2000,
    height: MOBILE ? 844 : 1100,
    deviceScaleFactor: 1,
    mobile: MOBILE,
  })
  await send('Page.navigate', { url: URL_ })

  const ready = `!!document.querySelector('canvas[data-ready="true"]')`
  for (let i = 0; i < 480 && !(await run(ready)); i++) await sleep(250)
  if (!(await run(ready)))
    throw new Error('the canvas never drew; is the dev server up?')
  await sleep(800) // let the fade and the entrance animation finish

  // Show only the canvas: no fade mask, no still behind it, nothing on top.
  const box = await run(`(() => {
    const c = document.querySelector('canvas[data-ready="true"]')
    const wrap = c.parentElement
    wrap.style.cssText += ';mask-image:none;-webkit-mask-image:none;background:none;opacity:1'
    wrap.parentElement.style.borderRadius = '0' // the panel's rounded corners would clip the canvas
    for (const el of wrap.parentElement.children) if (el !== wrap) el.style.visibility = 'hidden'
    c.scrollIntoView({ block: 'center' })
    const r = c.getBoundingClientRect()
    // the screenshot clip is in page coordinates, so add the scroll offset
    return { x: r.x + scrollX, y: r.y + scrollY, w: c.width, h: c.height, cssW: r.width, cssH: r.height }
  })()`)
  if (Math.abs(box.cssW - box.w) > 0.01 || Math.abs(box.cssH - box.h) > 0.01)
    throw new Error(`canvas is scaled: ${JSON.stringify(box)}`)
  await sleep(300)
  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: box.x, y: box.y, width: box.w, height: box.h, scale: 1 },
  })
  const { data, info } = await sharp(Buffer.from(shot.result.data, 'base64'))
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  if (info.width !== box.w || info.height !== box.h)
    throw new Error(
      `screenshot is ${info.width}x${info.height}, canvas is ${box.w}x${box.h}`,
    )

  // One pixel per cell. gl_FragCoord counts from the bottom, so a cell's
  // bottom-most pixel row is H - 1 - PIXEL * j.
  const gx = Math.ceil(info.width / PIXEL)
  const gy = Math.ceil(info.height / PIXEL)
  const raw = Buffer.alloc(gx * gy * 3)
  for (let j = 0; j < gy; j++) {
    const srcY = info.height - 1 - PIXEL * j
    for (let i = 0; i < gx; i++) {
      const s = (srcY * info.width + PIXEL * i) * 3
      const d = ((gy - 1 - j) * gx + i) * 3
      raw[d] = data[s]
      raw[d + 1] = data[s + 1]
      raw[d + 2] = data[s + 2]
    }
  }
  const colours = new Set()
  for (let i = 0; i < raw.length; i += 3)
    colours.add((raw[i] << 16) | (raw[i + 1] << 8) | raw[i + 2])
  if (colours.size > 4)
    throw new Error(`expected 4 colours, found ${colours.size}`)
  await sharp(raw, { raw: { width: gx, height: gy, channels: 3 } })
    .png({ palette: true, colours: 4, dither: 0, effort: 10 })
    .toFile(OUT)
  console.log(
    `${OUT}: ${gx}x${gy} cells from a ${info.width}x${info.height} canvas (${colours.size} colours)`,
  )
  ws.close()
} finally {
  chrome.kill()
  rmSync(profile, { recursive: true, force: true })
}
