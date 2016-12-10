import createServer from './server'
import env from './env'
import { log } from './shared'

const server = createServer(env.PORT)

server.start((err) => {
  if (err) {
    throw err
  }
  log(`Server listening on ${server.info.uri}`)
})
