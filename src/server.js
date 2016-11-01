const Hapi = require('hapi')
const env = require('./env')
const schemas = require('./helpers/schemas')
const validate = require('./helpers/validate')
const userRepository = require('./services/storage/repositories/user')

const { ValidationError } = validate

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
      const dbResponse = await userRepository.create(validatedUser)
      reply(validatedUser).code(201)
    } catch (e) {
      if (e instanceof ValidationError) {
        reply({ error: true }).code(400)
      } else {
        reply({ error: true }).code(500)
      }
    }
  }
})

/**
 * Log in a registered user.
 */
server.route({
  method: 'POST',
  path: '/auth/login',
  handler: (request, reply) => {
    validate(request.payload, schemas.auth).then(user => {
      reply({})
    }).catch(err => {
      reply({ error: true }).code(400)
    })
  }
})

module.exports = server
