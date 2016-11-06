import * as Boom from 'boom'
import * as Hapi from 'hapi'
import { createToken, verifyToken } from './helpers/auth'
import env from './env'
const schemas = require('./helpers/schemas')
import { compare, hash } from './helpers/crypto'
import validate from './helpers/validate'
const userRepository = require('./services/storage/repositories/user')
const trackRepository = require('./services/storage/repositories/track')

const server = new Hapi.Server()
server.connection({ port: env.PORT })

const isProductionEnvironment = process.env.NODE_ENV === 'production'
const isTestEnvironment = process.env.NODE_ENV === 'test'

const log = (message: string) => {
  if (!isProductionEnvironment) {
    // eslint-disable-next-line no-console
    console.log(message)
  }
}

async function register(request: Hapi.Request, reply: Hapi.IReply) {
  try {
    const validatedUser = await validate(request.payload, schemas.auth)
    const password = await hash(validatedUser.password)
    const user = Object.assign({}, validatedUser, { password })
    const dbResponse = await userRepository.create(user)
    reply({}).code(201)
  } catch (error) {
    log(error)
    reply(error)
  }
}

/**
 * Register a new user.
 */
server.route({
  method: 'POST',
  path: '/auth/register',
  handler: register
})


async function login(request: Hapi.Request, reply: Hapi.IReply) {
  try {
    const validatedUser = await validate(request.payload, schemas.auth)
    const user = await userRepository.findByEmail(validatedUser.email)
    const passedPassword = validatedUser.password
    const passwordHash = user._source.password
    const passwordsMatch = await compare(passedPassword, passwordHash)
    if (!passwordsMatch) {
      throw Boom.badRequest()
    }
    const token = await createToken({ userId: user._id })
    reply(token)
  } catch (error) {
    log(error)
    reply(error)
  }
}

/**
 * Log in a registered user.
 */
server.route({
  method: 'POST',
  path: '/auth/login',
  handler: login
})

async function whoami(request: Hapi.Request, reply: Hapi.IReply) {
  try {
    const user = await getCurrentUser(request.headers['authorization'])
    return reply(Object.assign({}, user._source, { password: undefined }))
  } catch (error) {
    log(error)
    return reply({})
  }
}

/**
 * Who am I?
 */
server.route({
  method: 'GET',
  path: '/me',
  handler: whoami
})

async function createTrack(request: Hapi.Request, reply: Hapi.IReply) {
  try {
    const user = await getCurrentUser(request.headers['authorization'])
    const validatedTrack = await validate(request.payload, schemas.track)
    const dbResponse = await trackRepository.create(validatedTrack)
    reply(validatedTrack).code(201)
  } catch (error) {
    log(error)
    reply(error)
  }
}

/**
 * Create a new track.
 */
server.route({
  method: 'POST',
  path: '/tracks',
  handler: createTrack
})

async function getCurrentUser(token: string) {
  const tokenPayload = await verifyToken(token)
  const user = await userRepository.find(tokenPayload.userId)
  return user
}

export default server
