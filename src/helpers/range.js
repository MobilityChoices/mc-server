/**
 * @param {number} n
 * @returns {number[]}
 */
const range = (n) => {
  if (typeof n !== 'number' || n < 0) {
    throw new Error('invalid argument (n)')
  }

  const arr = []
  for (let i = 0; i < n; i += 1) {
    arr.push(i)
  }
  return arr
}

module.exports = range
