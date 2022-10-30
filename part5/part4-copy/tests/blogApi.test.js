const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')

let TOKEN = null
let USER_ID = null

let initialBlogs = [
  {
    title: 'test',
    author: 'bryce',
    url: 'google.com',
    likes: 10,
  },
  {
    title: 'asd',
    author: 'bryce2',
    url: 'google.com',
    likes: 100,
  },
]

beforeAll(async () => {
  await User.deleteMany({})
  const newUser = {
    username: 'testing',
    name: 'testing',
    password: 'testing',
  }

  const newuser = await User(newUser).save()
  const user = await User.findOne({ username: newUser.username })
  const userForToken = {
    username: user.username,
    id: user._id,
  }
  TOKEN = `Bearer ${jwt.sign(userForToken, config.JWT_SECRET)}`
  USER_ID = user._id
})

beforeEach(async () => {
  await Blog.deleteMany({})
  let blog = new Blog(initialBlogs[0])
  blog['user'] = USER_ID
  await blog.save()
  blog = new Blog(initialBlogs[1])
  blog['user'] = USER_ID
  await blog.save()
})

test('Blogs are returned', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(response.body).toHaveLength(initialBlogs.length)
  response.body.map((e) => expect(e['id']).toBeDefined())
})

test('Blogs have id instead of _id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(response.body).toHaveLength(initialBlogs.length)
  response.body.map((e) => expect(e['id']).toBeDefined())
})

test('Blog is created', async () => {
  const newBlog = {
    title: 'new',
    author: 'brycenew',
    url: 'google.com',
    likes: 9,
  }
  response = await api
    .post('/api/blogs')
    .set('Authorization', TOKEN)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(response.body).toHaveLength(initialBlogs.length + 1)
})

test('Blog is not created if no auth token', async () => {
  const newBlog = {
    title: 'new',
    author: 'brycenew',
    url: 'google.com',
    likes: 9,
  }
  response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

test('Blog is defaulted with 0 likes', async () => {
  const newBlog = {
    title: 'new',
    author: 'brycenew',
    url: 'google.com',
  }
  let response = await api
    .post('/api/blogs')
    .set('Authorization', TOKEN)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body['likes']).toBeDefined()
  expect(response.body['likes']).toEqual(0)
})
test('Error if create blog request does not have url or title', async () => {
  let newBlog = {
    title: 'new',
    author: 'brycenew',
  }
  let response = await api
    .post('/api/blogs')
    .set('Authorization', TOKEN)
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  newBlog = {
    author: 'brycenew',
    url: 'google.com',
  }
  response = await api
    .post('/api/blogs')
    .set('Authorization', TOKEN)
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  newBlog = {
    author: 'brycenew',
  }
  response = await api
    .post('/api/blogs')
    .set('Authorization', TOKEN)
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('Deletion of blog', async () => {
  const blogEntry = {
    title: 'delete this',
    author: 'bryce',
    url: 'google.com',
    likes: 10,
  }

  let response = await api
    .post(`/api/blogs`)
    .set('Authorization', TOKEN)
    .send(blogEntry)
    .expect(201)

  await api
    .delete(`/api/blogs/${response.body['id']}`)
    .set('Authorization', TOKEN)
    .expect(200)

  blogs = await Blog.findById(response.body['id'])
  expect(blogs).toBeNull()
})

test('Editing of blog', async () => {
  let blogs = await Blog.find({})
  let response = await api
    .put(`/api/blogs/${blogs[0]['id']}`)
    .send({
      title: 'new',
    })
    .expect(200)

  expect(response.body.title).toBeDefined()
  expect(response.body.title).toEqual('new')
})

test('Error if username and password not provided', async () => {
  let newUser = {}
  let response = await api.post('/api/users').send(newUser).expect(400)
  expect(response.body.error).toBeDefined()
  expect(response.body).toEqual({
    error: 'Must enter username and password',
  })

  newUser = {
    username: 'asda',
  }
  response = await api.post('/api/users').send(newUser).expect(400)
  expect(response.body.error).toBeDefined()
  expect(response.body).toEqual({
    error: 'Must enter username and password',
  })

  newUser = {
    password: 'asda',
  }
  response = await api.post('/api/users').send(newUser).expect(400)
  expect(response.body.error).toBeDefined()
  expect(response.body).toEqual({
    error: 'Must enter username and password',
  })
})

test('Error if username and password not at least 3 characters long', async () => {
  let newUser = {
    username: 'abc',
    password: 'ab',
  }
  let response = await api.post('/api/users').send(newUser).expect(400)
  expect(response.body.error).toBeDefined()
  expect(response.body).toEqual({
    error: 'Username and password must be at least 3 characters long',
  })
  newUser = {
    username: 'ab',
    password: 'abc',
  }
  response = await api.post('/api/users').send(newUser).expect(400)
  expect(response.body.error).toBeDefined()
  expect(response.body).toEqual({
    error: 'Username and password must be at least 3 characters long',
  })
  newUser = {
    username: 'ab',
    password: 'ab',
  }
  response = await api.post('/api/users').send(newUser).expect(400)
  expect(response.body.error).toBeDefined()
  expect(response.body).toEqual({
    error: 'Username and password must be at least 3 characters long',
  })
})

test('Error if username is not unique', async () => {
  let newUser = {
    username: 'testing',
    password: 'abc',
  }
  let response = await api.post('/api/users').send(newUser).expect(400)
  expect(response.body.error).toBeDefined()
  expect(response.body).toEqual({
    error: 'Username has already been taken',
  })
})

test('User succesfully created if all requirements are met', async () => {
  let newUser = {
    username: 'testingg',
    password: 'abc',
  }
  await api.post('/api/users').send(newUser).expect(201)
})

afterAll(() => {
  mongoose.connection.close()
})
