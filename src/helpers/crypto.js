const bcrypt = require('bcrypt')

/**
 * @param {string} data
 */
const hash = (data) => new Promise((resolve, reject) => {
  bcrypt.hash(data, 10, (err, hash) => {
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
const compare = (data, hash) => new Promise((resolve, reject) => {
  bcrypt.compare(data, hash, (err, result) => {
    if (err) {
      return reject(err)
    }
    return resolve(result)
  })
})

module.exports = {
  compare,
  hash,
}
