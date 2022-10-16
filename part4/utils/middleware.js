const User = require('../models/user')
const jwt = require('jsonwebtoken')

const attachUser = async (req, res, next) => {
  let token = null
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7)
  }

  if (!token) {
    req.body.authUser = null
    return next()
  }
  req.token = token
  let decodedToken = null
  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (err) {
    return next(err)
  }

  if (!decodedToken || !decodedToken.id) {
    req.body.authUser = null
    return next()
  }
  const user = await User.findById(decodedToken.id)
  req.body.authUser = user
  return next()
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id',
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message,
    })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }

  next(error)
}

module.exports = {
  attachUser,
  errorHandler,
}
