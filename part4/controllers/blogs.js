const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  return response.status(200).json(blogs)
})

router.post('/', async (request, response) => {
  if (!request.body.authUser) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (!('url' in request.body) || !('title' in request.body)) {
    return response.status(400).json({
      success: false,
    })
  }
  const userId = request.body.authUser._id.toString()
  const blog = new Blog(request.body)
  blog.user = userId
  const result = await blog.save()

  request.body.authUser.blogs = request.body.authUser.blogs.concat(userId)
  await request.body.authUser.save()

  response.status(201).json(result)
})

router.delete('/:id', async (request, response) => {
  if (!request.body.authUser) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const id = request.params.id
  const userId = request.body.authUser._id.toString()
  const blog = await Blog.findById(id)
  if (!blog) {
    return response.status(500).json({
      error: 'No Blog found',
    })
  }

  if (blog.user.toString() !== userId) {
    return response.status(400).json({
      error: 'You are not the author',
    })
  }
  await Blog.findByIdAndDelete(id)
  return response.status(200).json({
    success: true,
  })
})

router.put('/:id', async (request, response) => {
  const id = request.params.id

  if ('user' in request.body && 'id' in request.body['user']) {
    request.body['user'] = mongoose.Types.ObjectId(request.body['user']['id'])
  }
  console.log(request.body)
  const updatedBlog = await Blog.findByIdAndUpdate(id, request.body, {
    new: true,
  })
  return response.status(200).json(updatedBlog)
})

module.exports = router
