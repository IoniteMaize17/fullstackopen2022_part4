const mongoose = require('mongoose')
const User = require('../models/user')
const Blog = require('../models/blog')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const newUserInfo = {
  name: 'Arto Hellas',
  username: 'hellas',
  password: 'hellas@2022',
}

let token = ''

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  await api.post('/api/users').send({ ...newUserInfo })
  const response = await api
    .post('/api/login')
    .send({ username: newUserInfo.username, password: newUserInfo.password })
  token = response.body.token
})

const newBlogTesting = {
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5
}

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .set({ Authorization: `Bearer ${token}` })
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('the unique blog posts ', async () => {
  const response = await api.get('/api/blogs').set({ Authorization: `Bearer ${token}` })
  const ids = response.body.map(r => r.id)
  expect(ids).toBeDefined()
})

test('a blog can be created', async () => {
  const beforeCreateBlogs = await api.get('/api/blogs').set({ Authorization: `Bearer ${token}` })
  const response = await api.post('/api/blogs').send({ ...newBlogTesting }).set({ Authorization: `Bearer ${token}` })
  const afterCreateBlogs = await api.get('/api/blogs').set({ Authorization: `Bearer ${token}` })
  expect(afterCreateBlogs.body).toHaveLength(beforeCreateBlogs.body.length + 1)
  expect(afterCreateBlogs.body.map(m => {
    return {
      ...m,
      user: m.user.id
    }
  })).toContainEqual(response.body)
})

test('the likes property is missing from the request', async () => {
  const newBlog = { ...newBlogTesting }
  delete newBlog.likes
  const response = await api.post('/api/blogs').send(newBlog).set({ Authorization: `Bearer ${token}` })
  if (Object.hasOwnProperty.call(newBlog, 'likes')) {
    expect(response.body).toHaveProperty('likes', newBlog.likes)
  } else {
    expect(response.body).toHaveProperty('likes', 0)
  }
})

test('verifies that if the title missing ', async () => {
  const newBlog = { ...newBlogTesting }
  delete newBlog.title
  await api.post('/api/blogs').send(newBlog).set({ Authorization: `Bearer ${token}` }).expect(400)
})

test('verifies that if the url  missing ', async () => {
  const newBlog = { ...newBlogTesting }
  delete newBlog.url
  await api.post('/api/blogs').send(newBlog).set({ Authorization: `Bearer ${token}` }).expect(400)
})

test('creates a new blog and delete it', async () => {
  const resource = await api.post('/api/blogs').send({ ...newBlogTesting }).set({ Authorization: `Bearer ${token}` })
  const beforeDeletingBlogs = await api.get('/api/blogs').set({ Authorization: `Bearer ${token}` })
  await api.delete('/api/blogs/' + resource.body.id).set({ Authorization: `Bearer ${token}` }).expect(204)
  const afterDeletingBlogs = await api.get('/api/blogs').set({ Authorization: `Bearer ${token}` })
  expect(afterDeletingBlogs.body).toHaveLength(beforeDeletingBlogs.body.length - 1)
  expect(afterDeletingBlogs.body).not.toContainEqual(beforeDeletingBlogs.body)
})

test('creates a new blog and update it', async () => {
  const resource = await api.post('/api/blogs').send({ ...newBlogTesting }).set({ Authorization: `Bearer ${token}` })
  resource.body.likes = 11
  const resourceUpdate = await api.put('/api/blogs/' + resource.body.id).send({
    title: resource.body.title,
    author: resource.body.author,
    url: resource.body.url,
    likes: resource.body.likes
  }).set({ Authorization: `Bearer ${token}` })
  expect(resource.body).toEqual(resourceUpdate.body)
})

afterAll(() => {
  mongoose.connection.close()
})