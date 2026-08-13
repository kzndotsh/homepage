const BASE_URL = 'https://api.github.com'
const TOKEN = '' // Replace with your GitHub token

const headers = {
  Authorization: `token ${TOKEN}`,
}

type GithubRepo = {
  name: string
  stargazers_count: number
}

type GithubUserStats = {
  totalRepos: number
  totalStars: number
  totalFollowers: number
  totalCommits: number
}

export const getUserStats = async (
  username: string,
): Promise<GithubUserStats | null> => {
  try {
    const repos = (await fetch(`${BASE_URL}/users/${username}/repos`, {
      headers,
    }).then((response) => response.json())) as GithubRepo[]

    const totalRepos = repos.length
    let totalStars = 0
    repos.forEach((repo) => (totalStars += repo.stargazers_count))

    const followersResponse = (await fetch(
      `${BASE_URL}/users/${username}/followers`,
      { headers },
    ).then((response) => response.json())) as unknown[]
    const totalFollowers = followersResponse.length

    let totalCommits = 0
    for (const repo of repos) {
      const commitsResponse = (await fetch(
        `${BASE_URL}/repos/${username}/${repo.name}/commits`,
        { headers },
      ).then((response) => response.json())) as unknown[]
      totalCommits += commitsResponse.length
    }

    return {
      totalRepos,
      totalStars,
      totalFollowers,
      totalCommits,
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return null
  }
}

getUserStats('kzndotsh').then((stats) => {
  if (stats) {
    console.log('User Stats:', stats)
  }
})
