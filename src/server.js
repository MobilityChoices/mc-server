const Hapi = require('hapi')
const env = require('./env')
const schemas = require('./helpers/schemas')
const validate = require('./helpers/validate')

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

module.exports = server
