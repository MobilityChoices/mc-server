import * as JWT from 'jsonwebtoken'
import * as env from '../env'

const signOptions = {
  noTimestamp: true,
}

export const createToken = (payload) => {
  return new Promise((resolve, reject) => {
    JWT.sign(payload, env.SECRET_KEY, signOptions, (err, token) => {
      if (err) {
        return reject(err)
      }
      return resolve(token)
    })
  })
}

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, env.SECRET_KEY, {}, (err, payload) => {
      if (err) {
        return reject(err)
      }
      return resolve(payload)
    })
  })
}
