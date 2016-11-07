import { assert } from 'chai'
import { createToken, verifyToken, Token } from '../../src/helpers/auth'

describe('auth', () => {
  const payload = { userId: 'abc' }
  // tslint:disable-next-line: max-line-length
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhYmMiLCJpYXQiOjE0Nzg1NDgwMDZ9.h2ZMEZIKkY3_qsGFnHnXtfJb_OQrRuNSch-eLSDDSzI'

  describe('createToken', () => {
    it('is a function', () => {
      assert.isFunction(createToken)
    })

    it('returns a string', () => {
      assert.isString(createToken(payload))
    })
  })

  describe('verifyToken', () => {
    it('is a function', () => {
      assert.isFunction(verifyToken)
    })

    context('token is valid', () => {
      it('returns the verified token', () => {
        const t = verifyToken(token) as Token
        assert.isObject(t)
        assert.isDefined(t.userId)
      })
    })

    context('token is invalid', () => {
      it('returns undefined', () => {
        assert.isUndefined(verifyToken(''))
      })
    })
  })
})
