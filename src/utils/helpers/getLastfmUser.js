import axios from 'axios'

const getLastfmUser = async (username) => {
  const lastfm = axios.create({
    baseURL: 'https://ws.audioscrobbler.com/2.0/',
    params: {
      api_key: '',
      format: 'json',
    },
  })
  const { data } = await lastfm.get('', {
    params: {
      method: 'user.getinfo',
      user: username,
    },
  })
  return data
}

export { getLastfmUser }
