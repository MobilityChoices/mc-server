const server = require('./server')

server.start((err) => {
  if (err) {
    throw err
  }
  console.log(`Server listening on ${server.info.uri}`) // eslint-disable-line no-console
})
