const { assert } = require('chai')
const { createToken, verifyToken } = require('../../src/helpers/auth')

describe('auth', () => {
  describe('createToken', () => {
    it('returns a string', () => {
      assert.isString(createToken({ uid: 'y82xa' }))
    })
  })

  describe('verifyToken', () => {
    context('token is valid', () => {
      let token = null

      beforeEach(() => {
        token = createToken({ uid: 'y82xa' })
      })

      afterEach(() => {
        token = null
      })

      it('returns the token', () => {
        assert.isObject(verifyToken(token))
      })
    })

    context('token is invalid', () => {

    })
  })
})
