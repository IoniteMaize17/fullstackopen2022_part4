const mongoose = require('mongoose')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const newUserInfo = {
  name: 'Arto Hellas',
  username: 'hellas',
  password: 'hellas@2022',
}

beforeEach(async () => {
  await User.deleteMany({})
  await api.post('/api/users').send({ ...newUserInfo })
})

test('Login success', async () => {
  const response = await api
    .post('/api/login')
    .send({
      username: newUserInfo.username,
      password: newUserInfo.password
    })
  expect(response.body).toHaveProperty('token')
})

test('Login fail', async () => {
  await api
    .post('/api/login')
    .send({
      username: newUserInfo.username,
      password: newUserInfo.password + '123'
    }).expect(401)
})
afterAll(() => {
  mongoose.connection.close()
})