const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const mongoose = require('mongoose')



blogsRouter.get('/', async (request, response, next) => {
  try {
    const listBlogs = await Blog.find({}).populate('user', { blogs: 0 })
    response.json(listBlogs)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const blogForm = { ...request.body }
    const blogNew = new Blog({
      title: blogForm.title,
      author: blogForm.author,
      url: blogForm.url,
      likes: blogForm.likes,
      user: request.user._id
    })
    const savedBlog = await blogNew.save()
    request.user.blogs = request.user.blogs.concat(savedBlog._id)
    await request.user.save()

    response.json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if ( blog.user.toString() === request.user.id ) {
      await Blog.findByIdAndRemove(request.params.id)
      request.user.blogs.splice(request.user.blogs.indexOf(mongoose.Types.ObjectId(request.params.id)), 1)
      request.user.save()
      response.status(204).end()
    } else {
      return response.status(401).json({ error: 'unauthorized' })
    }
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body
    const blogUpdateForm = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    }
    const blog = await Blog.findById(request.params.id)
    if ( blog.user.toString() === request.user.id ) {
      const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogUpdateForm, { new: true, runValidators: true, context: 'query' })
      response.json(updatedBlog)
    } else {
      return response.status(401).json({ error: 'unauthorized' })
    }
  } catch (exception) {
    next(exception)
  }
})



module.exports = blogsRouter