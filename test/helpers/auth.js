import { assert } from 'chai'
import { createToken, verifyToken } from '../../src/helpers/auth'
import { encodedPayload, payload, token } from '../mocks/auth'

describe('auth', () => {
  describe('createToken', () => {
    it('returns a Promise', () => {
      assert.instanceOf(createToken(payload), Promise)
    })

    it('resolves the token', (done) => {
      createToken(payload).then(t => {
        assert.equal(t, token)
        done()
      })
    })
  })

  describe('verifyToken', () => {
    it('returns a promise', () => {
      assert.instanceOf(verifyToken(token), Promise)
    })

    context('token is valid', () => {
      it('resolves the token', (done) => {
        verifyToken(token).then(p => {
          assert.deepEqual(p, payload)
          done()
        })
      })
    })

    context('token is invalid', () => {
      it('rejects', (done) => {
        verifyToken(token.replace('e', 'z')).catch(err => {
          done()
        })
      })
    })
  })
})
