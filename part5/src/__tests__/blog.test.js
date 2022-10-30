import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'
import LikeButton from '../components/LikeButton'
import CreateBlogSection from '../components/CreateBlogSection'

test('Blog Component renders blog content without url and number of likes', async () => {
  const blog = {
    title: 'test title',
    author: 'test author',
    url: 'google.com',
    likes: 10,
  }

  render(<Blog blog={blog} refreshBlog={() => {}} />)

  screen.getByText(blog['title'])
  screen.getByText(blog['author'])
  expect(screen.queryByTestId('blog-url')).toBeNull()
  expect(screen.queryByTestId('blog-likes')).toBeNull()
})

test('Clicking like button twice calls event handler twice', async () => {
  const blog = {
    title: 'test title',
    author: 'test author',
    url: 'google.com',
    likes: 10,
  }

  const mockFn = jest.fn()
  render(<LikeButton blog={blog} onClick={mockFn} />)

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockFn.mock.calls).toHaveLength(2)
})

test('Clicking submit button passes the new blog details to event handler', async () => {
  const mockFn = jest.fn()
  const { container } = render(<CreateBlogSection handlePostBlog={mockFn} />)

  const titleInpt = container.querySelector('#title-input')
  const authorInpt = container.querySelector('#author-input')
  const urlInpt = container.querySelector('#url-input')

  const user = userEvent.setup()
  await user.type(titleInpt, 'test title')
  await user.type(authorInpt, 'test author')
  await user.type(urlInpt, 'test url')

  const button = screen.getByText('create')
  await user.click(button)

  expect(mockFn.mock.calls).toHaveLength(1)
  expect(mockFn.mock.calls[0][0].title).toBe('test title')
  expect(mockFn.mock.calls[0][0].author).toBe('test author')
  expect(mockFn.mock.calls[0][0].url).toBe('test url')
})
