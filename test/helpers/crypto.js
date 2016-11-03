import { assert } from 'chai'
import { compare, hash } from '../../src/helpers/crypto'

const data = 'password'
const dataHash = '$2a$10$UwDFujg4zKu4Udeefl4jLOcUkMGzFOjwkCH3rJww4pi6amKLkRbAm'

describe('crypto', () => {
  describe('hash(data)', () => {
    it('returns a promise', () => {
      assert.instanceOf(hash(data), Promise)
    })

    it('resolves to the hash of the passed string', (done) => {
      hash(data).then(hash => {
        done()
      })
    })
  })

  describe('compare(data, hash)', () => {
    it('returns a promise', () => {
      assert.instanceOf(compare(data, dataHash), Promise)
    })

    context('data and hash do not match', () => {
      it('resolves to false', (done) => {
        compare('wrong-password', dataHash).then(result => {
          assert.isFalse(result)
          done()
        })
      })
    })

    context('data and hash do match', () => {
      it('resolves to true', (done) => {
        compare(data, dataHash).then(result => {
          assert.isTrue(result)
          done()
        })
      })
    })
  })
})
