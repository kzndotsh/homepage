import { preload } from 'react-dom'

import { SkylineCanvas } from './SkylineCanvas'

import s from '../skyline.module.css'

const PHOTO = '/skyline/charlotte.webp'
/** A smaller texture for the phone band, which is drawn at 356px wide. */
const PHOTO_MOBILE = '/skyline/charlotte-mobile.webp'
/** One frame of the shader, baked by scripts/skyline-placeholder.py. */
const STILL = '/skyline/charlotte-dither.png'
/** The phone band's frame, baked with `--mobile`. */
const STILL_MOBILE = '/skyline/charlotte-dither-mobile.png'
const CREDIT_URL =
  'https://commons.wikimedia.org/wiki/File:Charlotte_night_skyline_2016.jpg'

/**
 * The dithered Charlotte night photo as a backdrop. Put it first inside a
 * positioned, overflow-hidden parent; it fades out towards the left. A baked
 * still shows at once and the live canvas fades in over it.
 */
export function SkylineBackdrop() {
  // Start both downloads with the HTML instead of waiting for the script.
  preload(STILL, {
    as: 'image',
    fetchPriority: 'high',
    media: '(min-width: 721px)',
  })
  preload(STILL_MOBILE, {
    as: 'image',
    fetchPriority: 'high',
    media: '(max-width: 720px)',
  })
  preload(PHOTO, { as: 'image', media: '(min-width: 721px)' })
  preload(PHOTO_MOBILE, { as: 'image', media: '(max-width: 720px)' })
  return (
    <>
      <div className={s.backdrop}>
        <SkylineCanvas src={PHOTO} srcPhone={PHOTO_MOBILE} fill />
      </div>
      <a className={s.credit} href={CREDIT_URL}>
        Photo: Nan Palmero, CC BY 2.0
      </a>
    </>
  )
}
