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
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('a blog can be created', async () => {
  const beforeCreateUsers = await api.get('/api/users')
  const response = await api.post('/api/users').send({ ...newUserInfo })
  const afterCreateUser = await api.get('/api/users')
  expect(afterCreateUser.body).toHaveLength(beforeCreateUsers.body.length + 1)
  expect(afterCreateUser.body).toContainEqual(response.body)
})

test('a user cannot be create with username < 3 character', async () => {
  await api.post('/api/users').send({
    ...newUserInfo,
    username: 'he'
  }).expect(400)
})

test('a user cannot be create with password < 3 character', async () => {
  await api.post('/api/users').send({
    ...newUserInfo,
    password: 'he'
  }).expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})