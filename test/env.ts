import { assert } from 'chai'
import env from '../src/env'

describe('env', () => {
  describe('ELASTIC_URL', () => {
    it('is defined', () => {
      assert.isDefined(env.ELASTIC_URL)
    })

    it('is a string', () => {
      assert.isString(env.ELASTIC_URL)
    })
  })

  describe('PORT', () => {
    it('is defined', () => {
      assert.isDefined(env.PORT)
    })

    it('is a number', () => {
      assert.isNumber(env.PORT)
    })
  })

  describe('SECRET_KEY', () => {
    it('is defined', () => {
      assert.isDefined(env.SECRET_KEY)
    })

    it('is a string', () => {
      assert.isString(env.SECRET_KEY)
    })
  })
})
