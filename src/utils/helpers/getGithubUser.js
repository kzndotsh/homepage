const BASE_URL = 'https://api.github.com'
const TOKEN = '' // Replace with your GitHub token

// Setup headers
const headers = {
  Authorization: `token ${TOKEN}`,
}

// Fetch total user repos and derive stats from them
export const getUserStats = async (username) => {
  try {
    const repos = await fetch(`${BASE_URL}/users/${username}/repos`, {
      headers,
    }).then((response) => response.json())

    const totalRepos = repos.length
    let totalStars = 0
    repos.forEach((repo) => (totalStars += repo.stargazers_count))

    const followersResponse = await fetch(
      `${BASE_URL}/users/${username}/followers`,
      { headers },
    ).then((response) => response.json())
    const totalFollowers = followersResponse.length

    // The GitHub API does not directly provide total commit counts for a user
    // Fetching commit counts can involve iterating over all repositories and contributions
    let totalCommits = 0
    for (const repo of repos) {
      const commitsResponse = await fetch(
        `${BASE_URL}/repos/${username}/${repo.name}/commits`,
        { headers },
      ).then((response) => response.json())
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

// Replace 'username' with the GitHub username you want to fetch stats for
getUserStats('kzndotsh').then((stats) => {
  if (stats) {
    console.log('User Stats:', stats)
  }
})
