import React from 'react'

export function WakatimeStatsCard() {
  const url = 'https://github-readme-stats.vercel.app/api/wakatime'

  const username = 'kzndotsh'

  const params = {
    username: username,
    layout: 'compact',
    theme: 'tokyonight',
    hide_border: true,
  }

  const queryString = new URLSearchParams(params).toString()

  return (
    <div>
      <img src={`${url}?${queryString}`} alt="Wakatime Stats" />
    </div>
  )
}
