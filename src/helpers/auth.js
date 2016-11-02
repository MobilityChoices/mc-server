import * as JWT from 'jsonwebtoken'
import * as env from '../env'

export const createToken = (payload) => {
  return JWT.sign(payload, env.SECRET_KEY)
}

export const verifyToken = (token) => {
  return JWT.verify(token, env.SECRET_KEY)
}
