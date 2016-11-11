import createServer from './server'
import env from './env'

const server = createServer(env.PORT)

server.start((err) => {
  if (err) {
    throw err
  }
  console.log(`Server listening on ${server.info.uri}`)
})
