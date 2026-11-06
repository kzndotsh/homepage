'use client'

import { useEffect, useRef } from 'react'

import { FRAGMENT, PIXEL, VERTEX } from '../shader'
import s from '../skyline.module.css'

/**
 * The phone band is always drawn at this size and scaled to fit by CSS
 * (object-fit: cover), the same way as its baked still, so the two line up at
 * every phone width. Keep in sync with scripts/skyline-placeholder.mjs --mobile.
 */
const PHONE = { w: 356, h: 280 }

/** Darkest to brightest. Resolved from the site tokens at runtime. */
const PALETTE = [
  '--color-tn-bg-deep',
  '--color-tn-blue-dim',
  '--color-tn-cyan',
  '--color-tn-paper',
] as const

const hex = (css: string): [number, number, number] => {
  const n = parseInt(css.trim().replace('#', ''), 16)
  return Number.isNaN(n)
    ? [0, 0, 0]
    : [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null
}

/**
 * Draws the dithered photo on a canvas. It pauses off screen, shows one still
 * frame under reduced motion, and leaves the dark background if WebGL is off.
 */
export function SkylineCanvas({
  src,
  fill = false,
}: {
  src: string
  /** Cover the positioned parent instead of sizing itself. */
  fill?: boolean
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
    })
    if (!gl) return
    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
    if (!vs || !fs) return
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl.useProgram(prog)

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    )
    const loc = gl.getAttribLocation(prog, 'a')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const u = (name: string) => gl.getUniformLocation(prog, name)
    const root = getComputedStyle(document.documentElement)
    PALETTE.forEach((name, i) =>
      gl.uniform3fv(u(`u_c${i}`), hex(root.getPropertyValue(name))),
    )
    gl.uniform1f(u('u_pixel'), PIXEL)
    // On a phone the banner is a short band, so lift the photo to leave sky above
    // the roofline for the stars, and use a finer star grid so it reads as a field.
    const phone = matchMedia('(max-width: 720px)')
    const sky = () => {
      const on = fill && phone.matches
      gl.uniform1f(u('u_lift'), on ? 0.13 : 0)
      gl.uniform1f(u('u_block'), on ? 10 : 14)
    }
    sky()

    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.uniform1i(u('u_tex'), 0)

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = performance.now()
    let ready = false
    let sized = false
    let shown = false
    let running = false
    let raf = 0

    const draw = () => {
      if (!ready || !sized) return
      gl.uniform2f(u('u_res'), canvas.width, canvas.height)
      gl.uniform1f(
        u('u_time'),
        reduced ? 3 : (performance.now() - start) / 1000,
      )
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      if (!shown) {
        // First real frame: let the CSS fade the canvas in over the placeholder.
        shown = true
        canvas.dataset.ready = 'true'
      }
    }
    const loop = () => {
      draw()
      if (running) raf = requestAnimationFrame(loop)
    }

    const photo = new Image()
    photo.onload = () => {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, photo)
      gl.uniform1f(u('u_texAspect'), photo.naturalWidth / photo.naturalHeight)
      ready = true
      draw()
    }
    photo.src = src

    const size = () => {
      const r = canvas.getBoundingClientRect()
      const fixed = fill && phone.matches
      canvas.width = fixed ? PHONE.w : Math.max(1, Math.round(r.width))
      canvas.height = fixed ? PHONE.h : Math.max(1, Math.round(r.height))
      sized = true
      sky()
      gl.viewport(0, 0, canvas.width, canvas.height)
      draw()
    }
    const resize = new ResizeObserver(size)
    resize.observe(canvas)

    const visible = new IntersectionObserver(([entry]) => {
      const show = entry.isIntersecting && !reduced
      if (show && !running) {
        running = true
        raf = requestAnimationFrame(loop)
      } else if (!show) {
        running = false
        cancelAnimationFrame(raf)
      }
    })
    visible.observe(canvas)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      resize.disconnect()
      visible.disconnect()
      photo.onload = null
    }
  }, [src, fill])

  return (
    <canvas ref={ref} className={fill ? s.fill : s.canvas} aria-hidden="true" />
  )
}
