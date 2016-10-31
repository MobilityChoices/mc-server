const { assert } = require('chai')
const range = require('../../src/helpers/range')

describe('range(n)', () => {
  context('n >= 0', () => {
    it('returns an array of length n', () => {
      for (let i = 0; i < 10; i += 1) {
        const result = range(i)
        assert.equal(result.length, i)
      }
    })

    it('returns an array [0 .. n-1]', () => {
      for (let i = 0; i < 10; i += 1) {
        const result = range(i)
        result.forEach((value, index) => {
          assert.equal(value, index)
        })
      }
    })
  })

  context('n < 0', () => {
    it('throws an Error', () => {
      assert.throws(range.bind(-1))
    })
  })
})
