import * as bcrypt from 'bcrypt'

const HASHING_ROUNDS = 10

/**
 * @param {string} data
 */
export const hash = (data) => new Promise((resolve, reject) => {
  bcrypt.hash(data, HASHING_ROUNDS, (err, hash) => {
    if (err) {
      return reject(err)
    }
    return resolve(hash)
  })
})


/**
 * @param {string} data
 * @param {string} hash
 */
export const compare = (data, hash) => new Promise((resolve, reject) => {
  bcrypt.compare(data, hash, (err, result) => {
    if (err) {
      return reject(err)
    }
    return resolve(result)
  })
})
