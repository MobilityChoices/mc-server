import { assert } from 'chai'
import * as types from '../src/types'

describe('isEmail', () => {
  context('value is a valid email address', () => {
    it('returns true', () => {
      assert.isTrue(types.isEmail('alpha.beta@gamma.com'))
      assert.isTrue(types.isEmail('alpha@omicron'))
    })
  })

  context('value is not a valid email address', () => {
    it('returns false', () => {
      assert.isFalse(types.isEmail('alpha.beta'))
      assert.isFalse(types.isEmail('@a'))
    })
  })
})
