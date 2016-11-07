import * as Boom from 'boom'
import * as Hapi from 'hapi'
import { createToken, verifyToken } from './helpers/auth'
import env from './env'
const schemas = require('./helpers/schemas')
import { compare, hash } from './helpers/crypto'
import validate from './helpers/validate'
import { Document } from './services/storage/repository'
import userRepository from './services/storage/repositories/user'
import trackRepository from './services/storage/repositories/track'
import { isString, User, UserInfo } from './types'

const server = new Hapi.Server()
server.connection({ port: env.PORT })

const isProductionEnvironment = process.env.NODE_ENV === 'production'
const isTestEnvironment = process.env.NODE_ENV === 'test'

const log = (message: string) => {
  if (!isProductionEnvironment) {
    // eslint-disable-next-line no-console
    console.log(message)
  }
}

const createUserInfo = (data: any): UserInfo | undefined => {
  if (isString(data.email) && isString(data.password)) {
    return {
      email: data.email,
      password: data.password,
    }
  }
}

const setPassword = (userInfo: UserInfo, password: string): UserInfo => ({
  email: userInfo.email,
  password: password,
})

/**
 * Register a new user.
 */
server.route({
  method: 'POST',
  path: '/auth/register',
  handler: (request, reply) => {
    const userInformation = createUserInfo(request.payload)
    if (!userInformation) {
      return reply({ success: false }).code(400)
    }
    hash(userInformation.password)
      .then(encryptedPassword => setPassword(userInformation, encryptedPassword))
      .then(userInfo => userRepository.create(userInfo))
      .then(response => reply({ success: true }))
      .catch(err => reply({ success: false }).code(500))
  }
})

/**
 * Log in a registered user.
 */
server.route({
  method: 'POST',
  path: '/auth/login',
  handler: (request, reply) => {
    const userInfo = createUserInfo(request.payload)
    if (!userInfo) {
      return reply({ success: false }).code(400)
    }
    let user: Document<User>
    userRepository.findByEmail(userInfo.email)
      .then(u => user = u)
      .then(user => compare(userInfo.password, user._source.password))
      .then(passwordsMatch => createToken({ userId: user._id }))
      .then(token => reply(token))
      .catch(err => reply(err))
  }
})

const sanitizeUser = (user: User) => {
  return Object.assign({}, user, { password: undefined })
}

/**
 * Who am I?
 */
server.route({
  method: 'GET',
  path: '/me',
  handler: (request, reply) => {
    const userToken = request.headers['authorization']
    verifyToken(userToken)
      .then(token => userRepository.find(token.userId))
      .then(user => reply(sanitizeUser(user._source)))
      .catch(err => reply(err).code(400))
  }
})

export default server
