'use client'

import React, { useState, useEffect } from 'react'

import StatCard from '@/components/Stats/StatCard'
import { getLastfmUser } from '@/utils/helpers/getLastfmUser'

export default function LastfmCard() {
  const [scrobbles, setScrobbles] = useState(0)
  const link = 'https://www.last.fm/user/growwithlogan'

  useEffect(() => {
    const fetchData = async () => {
      const data = await getLastfmUser('growwithlogan')
      setScrobbles(data.user.playcount)
    }
    fetchData()
  }, [])

  return (
    <div className="my-2 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      <StatCard
        header="Last.fm Scrobbles"
        link={link}
        metric={scrobbles}
        isCurrency={false}
      />
    </div>
  )
}
