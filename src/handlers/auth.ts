import { Request, IReply } from 'hapi'
import userRepository from '../services/storage/repositories/user'
import { createToken, verifyToken } from '../helpers/auth'
import { compare, encrypt } from '../helpers/crypto'
import {
  isString,
  isEmail,
  Maybe,
  Error,
  UserInfo,
} from '../types'
import { serverError }  from '../helpers/errors'

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
    return reply(serverError).code(500)
  }
}
async function register(request: Request, reply: IReply) {
  const [userInfo, error] = createUserInfo(request.payload)
  if (!userInfo) {
    return reply({ error: error || {} }).code(400)
  } else {
    const encryptedPassword = encrypt(userInfo.password)
    userInfo.password = encryptedPassword
    try {
      const userId = await userRepository.create(userInfo)
      reply('').code(201)
    } catch (e) {
      reply(serverError).code(500)
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
  let error: Maybe<Error>
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
