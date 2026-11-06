import { cv } from '@/content'
import { cx } from '@/lib/cx'

import s from '../resume.module.css'

/** Downloads the PDF version of the resume. */
export function DownloadButton({ className }: { className?: string }) {
  return (
    <a className={cx(s.download, className)} href={cv.pdf} download>
      <svg
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
      </svg>
      Download PDF
    </a>
  )
}
