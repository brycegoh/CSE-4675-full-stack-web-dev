import { useState } from 'react'
import PropTypes from 'prop-types'

import blogService from '../services/blogs'
import LikeButton from './LikeButton'

const Blog = ({ blog, refreshBlog }) => {
  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    refreshBlog: PropTypes.func.isRequired,
  }

  const [toShow, setToShow] = useState(false)
  const userJson = window.localStorage.getItem('user')
  const USER = JSON.parse(userJson)
  const toggleShow = (e) => {
    e.preventDefault()
    setToShow(!toShow)
  }
  return (
    <div
      id={`${blog.title + blog.author + blog.url}`}
      className="blog"
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        alignItems: 'start',
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5,
        padding: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'start',
        }}
      >
        <span>
          <div id="blog-title">{blog.title}</div>{' '}
          <div id="blog-author">{blog.author}</div>
        </span>
        {toShow ? (
          <>
            <div id="blog-url">{blog.url}</div>
            <div id="blog-likes">
              {blog.likes} likes{' '}
              <LikeButton
                onClick={async () => {
                  const copy = { ...blog }
                  copy['likes'] = copy['likes'] + 1
                  await blogService.updateBlog(copy)
                  await refreshBlog()
                }}
                blog={blog}
              />
            </div>

            {blog.user &&
            blog.user.username === USER.username &&
            blog.user.name === USER.name ? (
              <button
                onClick={async () => {
                  if (
                    window.confirm(
                      `Remove blog ${blog.title} by ${blog.author}`
                    )
                  ) {
                    await blogService.deleteBlog(blog)
                    await refreshBlog()
                  }
                }}
              >
                Delete
              </button>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      <button
        style={{ marginLeft: '10px' }}
        onClick={toggleShow}
        id="toggle-view-btn"
      >
        {toShow ? 'Hide' : 'View'}
      </button>
    </div>
  )
}

export default Blog
