'use client'

import { useEffect, useRef } from 'react'

import s from '../home.module.css'

const COUNT = 70
const COLORS = [
  'var(--color-tn-yellow)',
  'var(--color-tn-green)',
  'var(--color-tn-cyan)',
  'var(--color-tn-magenta)',
  'var(--color-tn-orange)',
  'var(--color-tn-paper)',
]

const SVG =
  '<svg viewBox="0 0 24 30" width="100%" height="100%" aria-hidden="true">' +
  '<path fill="currentColor" d="M12 1C6.5 1 2 11 2 18a10 10 0 0 0 20 0C22 11 17.5 1 12 1z"/>' +
  '<path fill="none" stroke="var(--color-tn-bg)" stroke-opacity=".45" stroke-width="2" stroke-linecap="round" d="M4 19c3-3 5 3 8 0s5 3 8 0"/>' +
  '</svg>'

function Egg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 30" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 1C6.5 1 2 11 2 18a10 10 0 0 0 20 0C22 11 17.5 1 12 1z"
      />
    </svg>
  )
}

/** Rains eggs over the viewport. Skipped under reduced motion. */
export function EggButton() {
  const layer = useRef<HTMLDivElement>(null)

  const rain = () => {
    const root = layer.current
    if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const h = window.innerHeight
    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement('span')
      const size = 14 + Math.random() * 20
      el.className = s.egg
      el.innerHTML = SVG
      el.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size * 1.25}px;color:${COLORS[i % COLORS.length]}`
      root.appendChild(el)
      const spin = (Math.random() - 0.5) * 720
      el.animate(
        [
          { transform: 'translateY(0) rotate(0deg)' },
          { transform: `translateY(${h + 80}px) rotate(${spin}deg)` },
        ],
        {
          duration: 1500 + Math.random() * 1800,
          delay: Math.random() * 1100,
          easing: 'cubic-bezier(0.5, 0, 0.9, 0.6)',
          fill: 'backwards',
        },
      ).onfinish = () => el.remove()
    }
  }

  // The command menu can set it off too.
  useEffect(() => {
    window.addEventListener('kzn:rain-eggs', rain)
    return () => window.removeEventListener('kzn:rain-eggs', rain)
  })

  return (
    <>
      <button
        type="button"
        className={s.eggBtn}
        onClick={rain}
        aria-label="Surprise"
      >
        <Egg className={s.eggIcon} />
      </button>
      <div ref={layer} className={s.eggLayer} aria-hidden="true" />
    </>
  )
}
