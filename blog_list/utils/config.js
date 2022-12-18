require('dotenv').config()

const PORT = process.env.PORT || 3003
const NODE_ENV = process.env.NODE_ENV || 'production'

let MONGODB_URI
if (NODE_ENV === 'test') {
  MONGODB_URI = process.env.MONGODB_TEST_URI
} else {
  MONGODB_URI = process.env.MONGODB_URI
}

module.exports = {
  MONGODB_URI,
  PORT,
  NODE_ENV
}