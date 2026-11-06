'use client'

import { useEffect, useRef } from 'react'

import { FRAGMENT, PIXEL, VERTEX } from '../shader'
import s from '../skyline.module.css'

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
      canvas.width = Math.max(1, Math.round(r.width))
      canvas.height = Math.max(1, Math.round(r.height))
      sized = true
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
  }, [src])

  return (
    <canvas ref={ref} className={fill ? s.fill : s.canvas} aria-hidden="true" />
  )
}
