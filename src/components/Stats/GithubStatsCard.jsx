/* eslint-disable @next/next/no-img-element */
// 'use client'
// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import StatCard from '@/components/Stats/StatCard'
// import getStars, { fetchCommits } from '@/utils/helpers/getStars'

// const baseURL = 'https://api.github.com/users/'

// export default function GitHub() {
//   const [data, setData] = useState({})
//   const token =
//     ''

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const user = 'kzndotsh' // replace with desired user
//         const config = {
//           headers: { Authorization: `token ${token}` },
//         }

//         const [{ data: userData }, stars, totalCommits] = await Promise.all([
//           axios.get(`${baseURL}${user}`, config),
//           getStars(),
//           fetchCommits(user),
//         ])

//         setData({ ...userData, stars, totalCommits })
//       } catch (error) {
//         console.log(error.message)
//       }
//     }

//     fetchData()
//   }, [])

//   return (
//     <div className="my-2 grid w-full grid-cols-1 gap-3 sm:grid-cols-4">
//       <StatCard
//         header="GitHub Repos"
//         link={`${baseURL}${data.login}`}
//         metric={data.public_repos}
//         isCurrency={false}
//       />
//       <StatCard
//         header="GitHub Stars"
//         link={`${baseURL}${data.login}`}
//         metric={data.stars}
//         isCurrency={false}
//       />
//       <StatCard
//         header="GitHub Commits"
//         link={`${baseURL}${data.login}`}
//         metric={data.totalCommits}
//         isCurrency={false}
//       />
//       <StatCard
//         header="Github Followers"
//         link={`${baseURL}${data.login}`}
//         metric={data.followers}
//         isCurrency={false}
//       />
//     </div>
//   )
// }

// "use client";
// import { useState, useEffect } from 'react'
// import { getUserStats } from '@/utils/helpers/getGithubUser' // Adjust the path as necessary

// const GithubStatsCard = ({ username }) => {
//   const [userStats, setUserStats] = useState({
//     totalRepos: 0,
//     totalStars: 0,
//     totalFollowers: 0,
//     totalCommits: 0,
//   })

//   useEffect(() => {
//     const fetchData = async () => {
//       const stats = await getUserStats(username)
//       if (stats) {
//         setUserStats(stats)
//       }
//     }

//     fetchData()
//   }, [username])

//   return (
//     <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
//       <div className="rounded-md bg-gray-100 p-4 shadow">
//         <div className="text-xl font-semibold">{userStats.totalRepos}</div>
//         <div>Total Repos</div>
//       </div>
//       <div className="rounded-md bg-gray-100 p-4 shadow">
//         <div className="text-xl font-semibold">{userStats.totalStars}</div>
//         <div>Total Stars</div>
//       </div>
//       <div className="rounded-md bg-gray-100 p-4 shadow">
//         <div className="text-xl font-semibold">{userStats.totalFollowers}</div>
//         <div>Total Followers</div>
//       </div>
//       <div className="rounded-md bg-gray-100 p-4 shadow">
//         <div className="text-xl font-semibold">{userStats.totalCommits}</div>
//         <div>Total Commits</div>
//       </div>
//     </div>
//   )
// }

// export default GithubStatsCard

export function GithubStatsCard() {
  const url = 'https://github-readme-stats.vercel.app/api'

  const usernamme = 'kzndotsh'

  const params = {
    username: usernamme,
    hide_title: false,
    hide_rank: false,
    rank_icon: 'percentile',
    show_icons: true,
    count_private: true,
    hide_border: true,
    card_width: 600,
    include_all_commits: true,
    number_format: 'long',
    theme: 'tokyonight',
    show: 'reviews, discussions_started, discussions_answered, prs_merged, prs_merged_percentage',
  }

  const queryString = new URLSearchParams(params).toString()

  return (
    <div>
      <img src={`${url}?${queryString}`} alt="Github Stats" />
    </div>
  )
}

export function GithubLangStatsCard() {
  const url = 'https://github-readme-stats.vercel.app/api/top-langs'

  const usernamme = 'kzndotsh'

  const params = {
    username: usernamme,
    hide_title: false,
    layout: 'normal',
    hide_border: true,
    theme: 'tokyonight',
    langs_count: 10,
    hide: 'roff, yasnippet, qml',
    card_width: 600,
  }

  const queryString = new URLSearchParams(params).toString()

  return (
    <div>
      <img src={`${url}?${queryString}`} alt="Github Lang Stats" />
    </div>
  )
}
