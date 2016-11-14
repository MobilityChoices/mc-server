import * as JWT from 'jsonwebtoken'
import env from '../env'
import userRepository from '../services/storage/repositories/user'
import { User } from '../helpers/types'
import { Document } from '../services/storage/repository'

export interface Token {
  userId: string
}

export const createToken = (payload: Token) => {
  return JWT.sign(payload, env.SECRET_KEY)
}

export const verifyToken = (token: string): Token | undefined => {
  try {
    return JWT.verify(token, env.SECRET_KEY)
  } catch (e) {
    return undefined
  }
}

export const getAuthenticatedUser = (requestToken: string): Promise<Document<User> | undefined> => {
  const token = verifyToken(requestToken)
  if (token) {
    return userRepository.find(token.userId)
  }
  return Promise.resolve(undefined)
}
