const totalLikes = (blogs) =>
  blogs.reduce((previousValue, blog) => previousValue + blog['likes'], 0)

const favoriteBlog = (blogs) =>
  blogs.reduce(
    (maxBlog, blog) =>
      maxBlog == null || blog['likes'] > maxBlog['likes'] ? blog : maxBlog,
    null
  )

const mostBlogs = (blogs) => {
  let freq = {}
  blogs.forEach((blog) => {
    if (blog['author'] in freq) {
      freq[blog['author']] += 1
    } else {
      freq[blog['author']] = 1
    }
  })

  return Object.keys(freq).reduce((prev, curr) => {
    return prev == null || freq[curr] > prev['blogs']
      ? {
          author: curr,
          blogs: freq[curr],
        }
      : prev
  }, null)
}

const mostLikes = (blogs) => {
  let freq = {}
  blogs.forEach((blog) => {
    if (blog['author'] in freq) {
      freq[blog['author']] += blog['likes']
    } else {
      freq[blog['author']] = blog['likes']
    }
  })

  return Object.keys(freq).reduce(
    (prev, curr) =>
      prev == null || freq[curr] > prev['likes']
        ? {
            author: curr,
            likes: freq[curr],
          }
        : prev,
    null
  )
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
