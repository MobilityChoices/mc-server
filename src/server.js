const Hapi = require('hapi')
const env = require('./env')
const validateTrack = require('./helpers/validateTrack')

const server = new Hapi.Server()
server.connection({ port: env.PORT })

/**
 * Create a new track.
 */
server.route({
  method: 'POST',
  path: '/tracks',
  handler: (request, reply) => {
    validateTrack(request.payload).then(track => {
      reply(track).code(201)
    }).catch(err => {
      reply({ error: true }).code(400)
    })
  }
})

module.exports = server
