import * as Hapi from 'hapi'
import auth from './handlers/auth'
import users from './handlers/users'
import tracks from './handlers/tracks'
import directions from './handlers/directions'

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
    handler: users.me,
  })

  server.route({
    method: 'POST',
    path: '/tracks',
    handler: tracks.create
  })

  server.route({
    method: 'GET',
    path: '/tracks',
    handler: tracks.all
  })

  server.route({
    method: 'GET',
    path: '/tracks/:id',
    handler: tracks.get,
  })

  server.route({
    method: 'GET',
    path: '/admin/tracks',
    handler: tracks.admin.all,
  })

  server.route({
    method: 'GET',
    path: '/directions',
    handler: directions.get,
  })

  return server
}

export default createServer
