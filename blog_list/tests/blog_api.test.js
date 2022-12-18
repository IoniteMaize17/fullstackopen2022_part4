const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const newBlogTesting = {
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5
}

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('the unique blog posts ', async () => {
  const response = await api.get('/api/blogs')
  const ids = response.body.map(r => r.id)
  expect(ids).toBeDefined()
})

test('a blog can be created', async () => {
  const beforeCreateBlogs = await api.get('/api/blogs')
  const response = await api.post('/api/blogs').send({ ...newBlogTesting })
  const afterCreateBlogs = await api.get('/api/blogs')
  expect(afterCreateBlogs.body).toHaveLength(beforeCreateBlogs.body.length + 1)
  expect(afterCreateBlogs.body).toContainEqual(response.body)
})

test('the likes property is missing from the request', async () => {
  const newBlog = { ...newBlogTesting }
  delete newBlog.likes
  const response = await api.post('/api/blogs').send(newBlog)
  if (Object.hasOwnProperty.call(newBlog, 'likes')) {
    expect(response.body).toHaveProperty('likes', newBlog.likes)
  } else {
    expect(response.body).toHaveProperty('likes', 0)
  }
})

test('verifies that if the title missing ', async () => {
  const newBlog = { ...newBlogTesting }
  delete newBlog.title
  await api.post('/api/blogs').send(newBlog).expect(400)
})

test('verifies that if the url  missing ', async () => {
  const newBlog = { ...newBlogTesting }
  delete newBlog.url
  await api.post('/api/blogs').send(newBlog).expect(400)
})

test('creates a new blog and delete it', async () => {
  const resource = await api.post('/api/blogs').send({ ...newBlogTesting })
  const beforeDeletingBlogs = await api.get('/api/blogs')
  await api.delete('/api/blogs/' + resource.body.id).expect(204)
  const afterDeletingBlogs = await api.get('/api/blogs')
  expect(afterDeletingBlogs.body).toHaveLength(beforeDeletingBlogs.body.length - 1)
  expect(afterDeletingBlogs.body).not.toContainEqual(beforeDeletingBlogs.body)
})

test('creates a new blog and update it', async () => {
  const resource = await api.post('/api/blogs').send({ ...newBlogTesting })
  resource.body.likes = 11
  const resourceUpdate = await api.put('/api/blogs/' + resource.body.id).send({
    title: resource.body.title,
    author: resource.body.author,
    url: resource.body.url,
    likes: resource.body.likes
  })
  expect(resource.body).toEqual(resourceUpdate.body)
})

afterAll(() => {
  mongoose.connection.close()
})