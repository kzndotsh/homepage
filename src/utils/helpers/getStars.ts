'use client'

const GITHUB_API_URL = 'https://api.github.com/users/'

type GithubRepo = {
  name: string
  fork: boolean
  stargazers_count: number
}

type GithubContributor = {
  contributions: number
}

export default async function getRepoDetails() {
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

export async function fetchUserDataAndRepos(user: string) {
  const response = await fetchFromGithubApi(`${user}/repos?per_page=100`)
  const repositories = ((await response.json()) as GithubRepo[]).filter(
    (repo) => !repo.fork,
  )

  return {
    repositories,
  }
}

export async function fetchFromGithubApi(path: string) {
  const url = `${GITHUB_API_URL}${path}`
  const token = ''

  const options = {
    headers: {
      Authorization: `token ${token}`,
    },
  }

  return await fetch(url, options)
}

export function calculateStars(repositories: GithubRepo[]) {
  return repositories.reduce((accumulator, repository) => {
    return accumulator + repository.stargazers_count
  }, 0)
}

export async function fetchCommits(user: string, repoName: string) {
  const response = await fetchFromGithubApi(`${user}/${repoName}/ontributors`)
  const contributors = (await response.json()) as GithubContributor[]

  return Array.isArray(contributors) && contributors.length
    ? contributors.reduce(
        (total, contributor) => total + contributor.contributions,
        0,
      )
    : 0
}
