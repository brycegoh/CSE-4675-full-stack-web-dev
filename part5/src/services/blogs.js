import axiosClient from './axiosClient'

const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axiosClient.axios.get(baseUrl)
  return request.then((response) => {
    response.data.sort(function (a, b) {
      let keyA = a['likes']
      let keyB = b['likes']
      if (keyA < keyB) return 1
      if (keyA > keyB) return -1
      return 0
    })
    return response.data
  })
}

const createBlog = async (title, author, url) => {
  const response = await axiosClient.axios.post(baseUrl, {
    title: title,
    author: author,
    url: url,
  })
  return response.data
}

const updateBlog = async (blog) => {
  const response = await axiosClient.axios.put(baseUrl + `/${blog.id}`, {
    user: blog.user.id,
    likes: blog.likes,
    author: blog.author,
    title: blog.title,
    url: blog.url,
  })
  return response.data
}

const deleteBlog = async (blog) => {
  const response = await axiosClient.axios.delete(baseUrl + `/${blog.id}`)
  return response.data
}

const service = { getAll, createBlog, updateBlog, deleteBlog }

export default service
