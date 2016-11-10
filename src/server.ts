import * as Hapi from 'hapi'
import auth from './handlers/auth'
import user from './handlers/user'

const createServer = (port: number) => {
  const server = new Hapi.Server()
  server.connection({ port: port })

  server.route({
    method: 'POST',
    path: '/auth/register',
    handler: auth.register,
  })

  server.route({
    method: 'POST',
    path: '/auth/login',
    handler: auth.login,
  })

  server.route({
    method: 'GET',
    path: '/me',
    handler: user.me,
  })

  return server
}

export default createServer
