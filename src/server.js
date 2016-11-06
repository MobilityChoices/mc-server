import * as Boom from 'boom'
import * as Hapi from 'hapi'
import { createToken, verifyToken } from './helpers/auth'
const env = require('./env')
const schemas = require('./helpers/schemas')
import { compare, hash } from './helpers/crypto'
import validate from './helpers/validate'
const userRepository = require('./services/storage/repositories/user')
const trackRepository = require('./services/storage/repositories/track')

const server = new Hapi.Server()
server.connection({ port: env.PORT })

const isProductionEnvironment = process.env.NODE_ENV === 'production'
const isTestEnvironment = process.env.NODE_ENV === 'test'

const log = (message) => {
  if (!isProductionEnvironment) {
    // eslint-disable-next-line no-console
    console.log(message)
  }
}

/**
 * Register a new user.
 */
server.route({
  method: 'POST',
  path: '/auth/register',
  handler: async (request, reply) => {
    try {
      const validatedUser = await validate(request.payload, schemas.auth)
      const password = await hash(validatedUser.password)
      const user = Object.assign({}, validatedUser, { password })
      const dbResponse = await userRepository.create(user)
      reply({}).code(201)
    } catch (error) {
      log(error)
      reply(error)
    }
  }
})

/**
 * Log in a registered user.
 */
server.route({
  method: 'POST',
  path: '/auth/login',
  handler: async (request, reply) => {
    try {
      const validatedUser = await validate(request.payload, schemas.auth)
      const user = await userRepository.findByEmail(validatedUser.email)
      const passedPassword = validatedUser.password
      const passwordHash = user._source.password
      const passwordsMatch = await compare(passedPassword, passwordHash)
      if (!passwordsMatch) {
        throw Boom.badRequest()
      }
      const token = await createToken({ userId: user._id })
      reply(token)
    } catch (error) {
      log(error)
      reply(error)
    }
  }
})

/**
 * Who am I?
 */
server.route({
  method: 'GET',
  path: '/me',
  handler: async (request, reply) => {
    try {
      const user = await getCurrentUser(request.headers['authorization'])
      return reply(Object.assign({}, user._source, { password: undefined }))
    } catch (error) {
      log(error)
      return reply({})
    }
  }
})

/**
 * Create a new track.
 */
server.route({
  method: 'POST',
  path: '/tracks',
  handler: async (request, reply) => {
    try {
      const user = await getCurrentUser(request.headers['authorization'])
      const validatedTrack = await validate(request.payload, schemas.track)
      const dbResponse = await trackRepository.create(validatedTrack)
      reply(validatedTrack).code(201)
    } catch (error) {
      log(error)
      reply(error)
    }
  }
})

const getCurrentUser = async (token) => {
  const tokenPayload = await verifyToken(token)
  const user = await userRepository.find(tokenPayload.userId)
  return user
}

module.exports = server
