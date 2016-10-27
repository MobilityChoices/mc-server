const Hapi = require('hapi')

const server = new Hapi.Server()
server.connection({ port: 3000 })

/**
 * Create a new track.
 */
server.route({
  method: 'POST',
  path: '/',
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
