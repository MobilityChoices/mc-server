import * as Hapi from 'hapi'
import { createToken, verifyToken } from './helpers/auth'
import { encrypt, compare } from './helpers/crypto'
import { Document } from './services/storage/repository'
import userRepository from './services/storage/repositories/user'
import trackRepository from './services/storage/repositories/track'
import { isString, isEmail, User, UserInfo } from './types'

const serverError = {
  error: {
    code: 'ServerError',
    message: 'an unexpected server error occurred.',
    target: ''
  }
}

const createServer = (port: number) => {
  const server = new Hapi.Server()
  server.connection({ port: port })

  const isProductionEnvironment = process.env.NODE_ENV === 'production'
  const isTestEnvironment = process.env.NODE_ENV === 'test'

  const log = (message: string) => {
    if (!isProductionEnvironment) {
      console.log(message)
    }
  }

  const createUserInfo = (data: any): UserInfo | undefined => {
    if (isString(data.email) && isString(data.password)) {
      return {
        email: data.email,
        password: data.password,
      }
    }
  }

  const setPassword = (userInfo: UserInfo, password: string): UserInfo => ({
    email: userInfo.email,
    password: password,
  })

  /**
   * Register a new user.
   */
  server.route({
    method: 'POST',
    path: '/auth/register',
    handler: (request, reply) => {
      const payload = request.payload
      let emailError: any
      let passwordError: any
      if (!isEmail(payload.email)) {
        emailError = {
          code: 'MalformedValue',
          target: 'email',
          message: 'email is not valid'
        }
      }
      if (!isString(payload.password) || payload.password.length <= 3) {
        passwordError = {
          code: 'MalformedValue',
          target: 'password',
          message: 'password is not valid'
        }
      }
      if (emailError || passwordError) {
        let error: any
        if (emailError && passwordError) {
          error = {
            code: 'BadArgument',
            message: 'Multiple errors in data',
            target: 'data',
            details: [
              emailError,
              passwordError
            ]
          }
        } else if (emailError) {
          error = emailError
        } else {
          error = passwordError
        }
        return reply({ error }).code(400)
      }
      const userInformation = createUserInfo(request.payload) !
      const encryptedPassword = encrypt(userInformation.password)
      userInformation.password = encryptedPassword
      userRepository.create(userInformation)
        .then(response => reply('').code(201))
        .catch(err => reply(serverError).code(500))
    }
  })

  /**
   * Log in a registered user.
   */
  server.route({
    method: 'POST',
    path: '/auth/login',
    handler: (request, reply) => {
      const userInfo = createUserInfo(request.payload)
      if (!userInfo) {
        return reply({ success: false }).code(400)
      }
      let user: Document<User>
      userRepository.findByEmail(userInfo.email)
        .then(u => user = u)
        .then(user => compare(userInfo.password, user._source.password))
        .then(passwordsMatch => createToken({ userId: user._id }))
        .then(token => reply(token))
        .catch(err => reply(err))
    }
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
