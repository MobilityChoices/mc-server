import { Request, IReply } from 'hapi'
import userRepository from '../services/storage/repositories/user'
import { createToken } from '../helpers/auth'
import { compare, encrypt } from '../helpers/crypto'
import {
  isString,
  isEmail,
  Maybe,
  UserInfo,
} from '../helpers/types'
import {
  Error,
  badArgumentError,
  serverError,
  malformedValueError,
}  from '../helpers/errors'

async function login(request: Request, reply: IReply) {
  const [userInfo, error] = createUserInfo(request.payload)
  if (!userInfo) {
    return reply({ error: error || {} }).code(400)
  }
  try {
    const user = await userRepository.findByEmail(userInfo.email)
    if (!user) {
      return reply({ error: {} }).code(400)
    }
    if (compare(userInfo.password, user._source.password)) {
      const token = createToken({ userId: user._id })
      return reply({ token }).code(200)
    } else {
      return reply({ error: {} }).code(400)
    }
  } catch (e) {
    return reply({ error: serverError() }).code(500)
  }
}

async function register(request: Request, reply: IReply) {
  const [userInfo, error] = createUserInfo(request.payload)
  if (!userInfo) {
    return reply({ error: error || {} }).code(400)
  } else {
    const emailUser = await userRepository.findByEmail(userInfo.email)
    if (emailUser) {
      return reply({ error: badArgumentError('email', 'already in use') }).code(400)
    }
    const encryptedPassword = encrypt(userInfo.password)
    userInfo.password = encryptedPassword
    try {
      const userId = await userRepository.create(userInfo)
      if (userId) {
        reply('').code(201)
      } else {
        reply({ error: serverError() }).code(500)
      }
    } catch (e) {
      reply({ error: serverError() }).code(500)
    }
  }
}

export default {
  login,
  register,
}

export const isValidPassword = (str: any) => {
  return isString(str) && str.length > 3
}

export const createUserInfo = (data: any): [Maybe<UserInfo>, Maybe<Error>] => {
  if (isEmail(data.email) && isValidPassword(data.password)) {
    const userInfo = {
      email: data.email,
      password: data.password,
    }
    return [userInfo, undefined]
  }

  const details: any[] = []
  if (!isEmail(data.email)) {
    details.push(malformedValueError('email', 'email is not valid'))
  }
  if (!isString(data.password) || data.password.length <= 3) {
    details.push(malformedValueError('password', 'password is not valid'))
  }
  if (details.length === 1) {
    return [undefined, details[0]]
  } else {
    return [undefined, badArgumentError('data', 'multiple errors', ...details)]
  }
}
