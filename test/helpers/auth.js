import { assert } from 'chai'
import { createToken, verifyToken } from '../../src/helpers/auth'
import { encodedPayload, payload, token } from '../mocks/auth'

describe('auth', () => {
  describe('createToken', () => {
    it('returns a Promise', () => {
      assert.instanceOf(createToken(payload), Promise)
    })

    it('resolves the token (header.payload.signature)', (done) => {
      createToken(payload).then(t => {
        assert.equal(t.split('.').length, 3)
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
          Object.keys(payload).forEach(key => {
            assert.equal(p[key], payload[key])
          })
          done()
        })
      })
    })

    context('token is invalid', () => {

    })
  })
})
