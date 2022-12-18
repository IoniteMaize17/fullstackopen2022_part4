const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response, next) => {
  try {
    const listUsers = await User.find({}).populate('blogs', { user: 0 })
    response.json(listUsers)
  } catch (exception) {
    next(exception)
  }
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const userForm = {
      name: request.body.name,
      username: request.body.username,
      password: request.body.password
    }
    if (userForm.password && userForm.password.length < 3) {
      response.status(400).json({ error: 'Password must be at least 3 characters long' })
    }
    const saltRounds = 10
    userForm.password = await bcrypt.hash(userForm.password, saltRounds)
    const newUser = new User(userForm)
    const userSaved = await newUser.save()
    response.json(userSaved)
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter