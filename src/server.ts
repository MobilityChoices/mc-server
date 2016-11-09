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

interface MCError {
  code: 'BadArgument' | 'ServerError'
  message?: string
  target?: string
  details?: MCError[]
}

const isProductionEnvironment = process.env.NODE_ENV === 'production'
const isTestEnvironment = process.env.NODE_ENV === 'test'

const log = (message: string) => {
  if (!isProductionEnvironment) {
    console.log(message)
  }
}

type Maybe<T> = T | undefined

const isValidPassword = (str: any) => {
  return isString(str) && str.length > 3
}

const createUserInfo = (data: any): [Maybe<UserInfo>, Maybe<MCError>] => {
  let error: Maybe<MCError>
  let emailError: any
  let passwordError: any

  if (isEmail(data.email) && isValidPassword(data.password)) {
    const userInfo = {
      email: data.email,
      password: data.password,
    }
    return [userInfo, undefined]
  }

  if (!isEmail(data.email)) {
    emailError = {
      code: 'MalformedValue',
      target: 'email',
      message: 'email is not valid'
    }
  }
  if (!isString(data.password) || data.password.length <= 3) {
    passwordError = {
      code: 'MalformedValue',
      target: 'password',
      message: 'password is not valid'
    }
  }
  if (emailError || passwordError) {
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
  }

  return [undefined, error]
}

const createServer = (port: number) => {
  const server = new Hapi.Server()
  server.connection({ port: port })

  /**
   * Register a new user.
   */
  server.route({
    method: 'POST',
    path: '/auth/register',
    handler: (request, reply) => {
      const [userInfo, error] = createUserInfo(request.payload)
      if (!userInfo) {
        return reply({ error: error || {} }).code(400)
      } else {
        const encryptedPassword = encrypt(userInfo.password)
        userInfo.password = encryptedPassword
        userRepository.create(userInfo)
          .then(response => reply('').code(201))
          .catch(err => reply(serverError).code(500))
      }
    }
  })

  /**
   * Log in a registered user.
   */
  server.route({
    method: 'POST',
    path: '/auth/login',
    handler: (request, reply) => {
      const [userInfo, error] = createUserInfo(request.payload)
      if (!userInfo) {
        return reply({ error: error || {} }).code(400)
      } else {
        let user: Document<User>
        userRepository.findByEmail(userInfo.email)
          .then(u => user = u)
          .then(user => {
            if (compare(userInfo.password, user._source.password)) {
              const token = createToken({ userId: user._id })
              reply({ token }).code(200)
            } else {
              reply({ error: { aargh: 'invalid password' }}).code(400)
            }
          })
          .catch(err => {
            reply({ error: { hugh: 'what?' }}).code(400)
          })
      }
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
