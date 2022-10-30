const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.get('/', async (request, response) => {
  const result = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
  })

  response.status(200).json(result)
})

router.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username || !password) {
    return response.status(400).json({
      error: 'Must enter username and password',
    })
  }
  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({
      error: 'Username and password must be at least 3 characters long',
    })
  }

  const dups = await User.find({ username: username })
  if (dups.length > 0) {
    return response.status(400).json({
      error: 'Username has already been taken',
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  return response.status(201).json(savedUser)
})

module.exports = router
