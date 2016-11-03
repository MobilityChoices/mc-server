import * as JWT from 'jsonwebtoken'
import * as env from '../env'

export const createToken = (payload) => {
  return new Promise((resolve, reject) => {
    JWT.sign(payload, env.SECRET_KEY, {}, (err, token) => {
      if (err) {
        console.log(err)
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
        console.log(err)
        return reject(err)
      }
      return resolve(payload)
    })
  })
}
