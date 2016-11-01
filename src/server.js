const Hapi = require('hapi')
const env = require('./env')
const schemas = require('./helpers/schemas')
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
  handler: (request, reply) => {
    validate(request.payload, schemas.auth).then(user => {
      userRepository.create(user).then(response => {
        reply(user).code(201)
      }).catch(err => {
        reply({ error: true }).code(500)
      })
    }).catch(err => {
      reply({ error: true }).code(400)
    })
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
