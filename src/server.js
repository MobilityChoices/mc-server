import * as Boom from 'boom'
import * as Hapi from 'hapi'
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
  handler: (request, reply) => {
    validate(request.payload, schemas.track).then(track => {
      reply(track).code(201)
    }).catch(err => {
      reply({ error: true }).code(400)
    })
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
      const passwordHash = await hash(validatedUser.password)
      const hashedUser = Object.assign({}, validatedUser, {
        password: passwordHash
      })
      const dbResponse = await userRepository.create(hashedUser)
      reply(validatedUser).code(201)
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
