const { assert } = require('chai')
const env = require('../src/env')

describe('env', () => {

  describe('PORT', () => {
    it('is defined', () => {
      assert.isDefined(env.PORT)
    })

    it('is a number', () => {
      assert.isNumber(env.PORT)
    })

    it('is at least 0', () => {
      assert.isAtLeast(env.PORT, 0)
    })

    it('is at most 65535', () => {
      assert.isAtMost(env.PORT, 65535)
    })
  })

  describe('ELASTIC_URL', () => {
    it('is defined', () => {
      assert.isDefined(env.ELASTIC_URL)
    })

    it('is a string', () => {
      assert.isString(env.ELASTIC_URL)
    })

    it('is a url', () => {
      /** @type {RegExp} */
      const urlRegex = /^https?:\/\/.+$/
      assert.isTrue(urlRegex.test(env.ELASTIC_URL))
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
