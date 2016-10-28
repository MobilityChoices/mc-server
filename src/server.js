const Hapi = require('hapi')
const env = require('./env')

const server = new Hapi.Server()
server.connection({ port: env.PORT })

/**
 * Create a new track.
 */
server.route({
  method: 'POST',
  path: '/tracks',
  handler: (request, reply) => {
    console.log(request.payload) // eslint-disable-line no-console
    reply({ status: 'ok' })
  }
})

server.start((err) => {
  if (err) {
    throw err
  }
  console.log(`Server listening on ${server.info.uri}`) // eslint-disable-line no-console
})
