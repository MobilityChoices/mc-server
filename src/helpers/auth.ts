import * as JWT from 'jsonwebtoken'
import env from '../env'

const signOptions = {
  noTimestamp: true,
}

export const createToken = (payload: Token) => {
  return new Promise((resolve, reject) => {
    JWT.sign(payload, env.SECRET_KEY, signOptions, (err, token) => {
      if (err) {
        return reject(err)
      }
      return resolve(token)
    })
  })
}

interface Token {
  userId: string
}

export const verifyToken = (token: string) => {
  return new Promise<Token>((resolve, reject) => {
    JWT.verify(token, env.SECRET_KEY, {}, (err, payload) => {
      if (err) {
        return reject(err)
      }
      return resolve(payload)
    })
  })
}
