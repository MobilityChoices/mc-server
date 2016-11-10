import * as Hapi from 'hapi'
import { createToken, verifyToken } from './helpers/auth'
import { encrypt, compare } from './helpers/crypto'
import { Document } from './services/storage/repository'
import userRepository from './services/storage/repositories/user'
import trackRepository from './services/storage/repositories/track'
import { User } from './types'
import auth from './handlers/auth'

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

  const sanitizeUser = (user: User) => {
    return Object.assign({}, user, { password: undefined })
  }

  /**
   * Who am I?
   */
  server.route({
    method: 'GET',
    path: '/me',
    handler: (request, reply) => {
      const token = verifyToken(request.headers['authorization'])
      if (!token) {
        return reply({}).code(400)
      }
      userRepository.find(token.userId)
        .then(user => reply(sanitizeUser(user._source)))
        .catch(err => reply(err).code(400))
    }
  })

  return server
}

export default createServer
