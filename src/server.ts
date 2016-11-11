import * as Hapi from 'hapi'
import auth from './handlers/auth'
import user from './handlers/user'

const createServer = (port: number, isTest = false) => {
  const server = new Hapi.Server()
  server.connection({ port: port })

  if (!isTest) {
    server.register({
      register: require('good'),
      options: {
        ops: { interval: 1000 },
        reporters: {
          consoleReporter: [
            { module: 'good-squeeze', name: 'Squeeze', args: [{ log: '*', response: '*' }] },
            { module: 'good-console' },
            'stdout'
          ]
        }
      }
    }, () => { })
  }

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
