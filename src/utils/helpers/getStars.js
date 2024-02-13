// const GITHUB_API_URL = 'https://api.github.com/users/'

// export default async function getStars(req, res) {
//   const { user, repositories } = await fetchUserDataAndRepos('kzndotsh')
//   const stars = calculateStars(repositories)

//   return stars
// }

// async function fetchUserDataAndRepos(username) {
//   const [user, repositories] = await Promise.all([
//     fetchFromGithubApi(username),
//     fetchFromGithubApi(`${username}/repos?per_page=100`),
//   ])

//   return {
//     user: await user.json(),
//     repositories: (await repositories.json()).filter((repo) => !repo.fork),
//   }
// }

// async function fetchFromGithubApi(path) {
//   return await fetch(`${GITHUB_API_URL}${path}`)
// }

// function calculateStars(repositories) {
//   return repositories.reduce((accumulator, repository) => {
//     return accumulator + repository['stargazers_count']
//   }, 0)
// }

'use client'

const GITHUB_API_URL = 'https://api.github.com/users/'

export default async function getRepoDetails(req, res) {
  const user = 'kzndotsh'

  const { repositories } = await fetchUserDataAndRepos(user)
  const stars = calculateStars(repositories)

  const totalCommitsArray = await Promise.all(
    repositories.map((repo) => fetchCommits(user, repo.name)),
  )
  const totalCommits = totalCommitsArray.reduce(
    (sum, current) => sum + current,
    0,
  )

  return {
    stars,
    totalCommits,
  }
}

export async function fetchUserDataAndRepos(user) {
  const response = await fetchFromGithubApi(`${user}/repos?per_page=100`)
  const repositories = (await response.json()).filter((repo) => !repo.fork)

  return {
    repositories,
  }
}

export async function fetchFromGithubApi(path) {
  const url = `${GITHUB_API_URL}${path}`
  const token =
    ''

  const options = {
    headers: {
      Authorization: `token ${token}`,
    },
  }

  return await fetch(url, options)
}

export function calculateStars(repositories) {
  return repositories.reduce((accumulator, repository) => {
    return accumulator + repository['stargazers_count']
  }, 0)
}

export async function fetchCommits(user, repoName) {
  const response = await fetchFromGithubApi(`${user}/${repoName}/ontributors`)
  const contributors = await response.json()

  // Check if contributors is an array and if it's not empty
  return Array.isArray(contributors) && contributors.length
    ? contributors.reduce(
        (total, contributor) => total + contributor.contributions,
        0,
      )
    : 0
}
