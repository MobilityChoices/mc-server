const range = require('./range')

const randomLetterOrDigit = () => {
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'.split('')
  const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const digits = '012456789'.split('')
  const chars = [...lowerCaseLetters, ...upperCaseLetters, ...digits]

  const randomIndex = Math.floor(Math.random() * chars.length)

  return chars[randomIndex]
}

/**
 * @param {number} n the requested uuid length
 * @returns {string} a uuid of length n
 */
const uuid = (n) => {
  return range(n).map(randomLetterOrDigit).join('')
}

module.exports = uuid
