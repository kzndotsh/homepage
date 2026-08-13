import axios from 'axios'

type LastfmUserResponse = {
  user: {
    playcount: string
  }
}

const getLastfmUser = async (username: string): Promise<LastfmUserResponse> => {
  const lastfm = axios.create({
    baseURL: 'https://ws.audioscrobbler.com/2.0/',
    params: {
      api_key: '',
      format: 'json',
    },
  })
  const { data } = await lastfm.get<LastfmUserResponse>('', {
    params: {
      method: 'user.getinfo',
      user: username,
    },
  })
  return data
}

export { getLastfmUser }
