import * as JWT from 'jsonwebtoken'
import env from '../env'

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
