const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  username: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  password: {
    type: String,
    minLength: 3,
    required: true
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'blogs'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  }
})

module.exports = mongoose.model('users', userSchema)