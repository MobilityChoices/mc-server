const { assert } = require('chai')
const elasticUrl = require('../../../src/services/storage/elasticUrl')

describe('elasticUrl', () => {
  it('returns a string', () => {
    assert.isString(elasticUrl('path'))
  })

  it('returns a valid url', () => {
    assert.isTrue(/^http[s]?:\/\/.*$/.test(elasticUrl('path')))
  })
})
