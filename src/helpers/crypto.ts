import * as bcrypt from 'bcrypt'

const HASHING_ROUNDS = 10

/**
 * @param {string} data
 */
export const hash = (data: string) => {
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(data, HASHING_ROUNDS, (err: Error, hash: string) => {
      if (err) {
        return reject(err)
      }
      return resolve(hash)
    })
  })
}

/**
 * @param {string} data
 * @param {string} hash
 */
export const compare = (data: string, hash: string) => new Promise((resolve, reject) => {
  bcrypt.compare(data, hash, (err, result) => {
    if (err) {
      return reject(err)
    }
    return resolve(result)
  })
})
