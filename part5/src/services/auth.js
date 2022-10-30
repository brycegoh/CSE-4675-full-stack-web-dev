import axiosClient from './axiosClient'

const baseUrl = '/api/login'

const login = (username, password) => {
  return axiosClient.axios.post(baseUrl, {
    username: username,
    password: password,
  })
}

const service = {
  login,
}

export default service
