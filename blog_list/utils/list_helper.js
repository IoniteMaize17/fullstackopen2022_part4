const dummy = (blogs) => {
  blogs
  return 1
}

const totalLikes = (blogs) => {
  if (! Array.isArray(blogs)) return 0
  return blogs.reduce((total, blog) => {
    if(blog.likes && Number.isInteger(blog.likes)) {
      return total + blog.likes
    }
    return total
  }, 0)
}

const favoriteBlog = (blogs) => {
  if (! Array.isArray(blogs)) return false
  if (blogs.length === 0) return false
  blogs = [...blogs]
  let maxLikeBlog = blogs.shift()
  blogs.forEach((blog) => {
    if (blog.likes > maxLikeBlog.likes) {
      maxLikeBlog = blog
    }
  })
  return {
    title: maxLikeBlog.title,
    author: maxLikeBlog.author,
    likes: maxLikeBlog.likes
  }
}

const mostBlogs = (blogs) => {
  if (! Array.isArray(blogs)) return false
  if (blogs.length === 0) return false
  blogs = [...blogs]
  const authors = []
  blogs.forEach((blog) => {
    const author_target= authors.find(f => f.author === blog.author)
    if (author_target) {
      author_target.blogs ++
    } else {
      authors.push({
        author: blog.author,
        blogs: 1
      })
    }
  })
  let maxBlogsAuthor = authors.shift()
  authors.forEach((author) => {
    if (author.blogs > maxBlogsAuthor.blogs) {
      maxBlogsAuthor = author
    }
  })

  return maxBlogsAuthor
}


const mostLikes = (blogs) => {
  if (! Array.isArray(blogs)) return false
  if (blogs.length === 0) return false
  blogs = [...blogs]
  const authors = []
  blogs.forEach((blog) => {
    const author_target= authors.find(f => f.author === blog.author)
    if (author_target) {
      author_target.likes += blog.likes
    } else {
      authors.push({
        author: blog.author,
        likes: blog.likes
      })
    }
  })
  let maxLikesAuthor = authors.shift()
  authors.forEach((author) => {
    if (author.likes > maxLikesAuthor.likes) {
      maxLikesAuthor = author
    }
  })

  return maxLikesAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}