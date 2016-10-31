const jwt = require('jsonwebtoken')
const env = require('../env')

const createToken = (payload) => {
  return jwt.sign(payload, env.SECRET_KEY)
}

const verifyToken = (token) => {
  return jwt.verify(token, env.SECRET_KEY)
}

module.exports = {
  createToken,
  verifyToken,
}
