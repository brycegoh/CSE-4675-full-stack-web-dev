import axios from 'axios'

axios.interceptors.request.use(
  function (config) {
    const user = window.localStorage.getItem('user')
    if (user) {
      config.headers.authorization = `Bearer ${JSON.parse(user).token}`
    }

    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

const exported = {
  axios,
}

export default exported
