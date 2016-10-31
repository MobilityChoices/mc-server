const { assert } = require('chai')
const uuid = require('../../src/helpers/uuid')

describe('uuid(length)', () => {
  context('length = n, n >= 0', () => {
    it('returns a random string of length n', () => {
      for (let i = 0; i < 10; i += 1) {
        const result = uuid(i)
        assert.isString(result)
        assert.equal(result.length, i)
      }
    })
  })

  context('length = n, n < 0', () => {
    it('throws an error', () => {
      assert.throws(uuid.bind(-1))
    })
  })
})
