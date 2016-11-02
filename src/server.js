import * as Boom from 'boom'
import * as Hapi from 'hapi'
import {} from './helpers/auth'
const env = require('./env')
const schemas = require('./helpers/schemas')
import { compare, hash } from './helpers/crypto'
const validate = require('./helpers/validate')
const userRepository = require('./services/storage/repositories/user')

const server = new Hapi.Server()
server.connection({ port: env.PORT })

/**
 * Create a new track.
 */
server.route({
  method: 'POST',
  path: '/tracks',
  handler: async (request, reply) => {
    try {
      const validatedTrack = await validate(request.payload, schemas.track)
      reply(validatedTrack).code(201)
    } catch (error) {
      reply(error)
    }
  }
})

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
      const passwordHash = user.data.password
      const passwordsMatch = await compare(passedPassword, passwordHash)
      if (!passwordsMatch) {
        throw Boom.badRequest()
      }
      reply({ loggedIn: true })
    } catch (error) {
      reply(error)
    }
  }
})

module.exports = server
