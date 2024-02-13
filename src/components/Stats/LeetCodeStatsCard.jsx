/* eslint-disable @next/next/no-img-element */

import React from 'react'

export function LeetCodeStatsCard() {
  const url = 'https://leetcard.jacoblin.cool/kzndotsh'

  const params = {
    ext: 'heatmap',
    sheets:
      'https://gist.githubusercontent.com/kzndotsh/79eedf6a84fcd05181fa77b1294e672c/raw/86592689edee40679d4bb2e1558563f73d5535f4/leetcodecard.css',
  }

  const queryString = new URLSearchParams(params).toString()

  return (
    <div>
      <img src={`${url}?${queryString}`} alt="Leetcode Stats" />
    </div>
  )
}
