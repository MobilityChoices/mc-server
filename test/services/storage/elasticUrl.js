const { assert } = require('chai')
const sinon = require('sinon')
const env = require('../../../src/env')
const elasticUrl = require('../../../src/services/storage/elasticUrl')

describe('elasticUrl', () => {
  it('returns a string', () => {
    assert.isString(elasticUrl('path'))
  })

  it('returns a valid url', () => {
    assert.isTrue(/^http[s]?:\/\/.*$/.test(elasticUrl('path')))
  })

  it('throws an error if ELASTIC_URL is not set', () => {
    const sandbox = sinon.sandbox.create()
    sandbox.stub(env, 'ELASTIC_URL', undefined)
    assert.throws(elasticUrl.bind('path'))
    sandbox.restore()
  })
})
