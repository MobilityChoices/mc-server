const { assert } = require('chai')
const validateTrack = require('../../src/helpers/validateTrack')
const track = require('../mocks/track-raw')

const invalidTrack = Object.assign({}, track, { owner: undefined })

describe('validateTrack', () => {
  it('returns a Promise', () => {
    assert.instanceOf(validateTrack(track), Promise)
  })

  context('valid track', () => {
    it('resolves the validated track', (done) => {
      validateTrack(track).then(validatedTrack => {
        assert.deepEqual(validatedTrack, track)
        done()
      })
    })
  })

  context('invalid track', () => {
    it('rejects', (done) => {
      validateTrack(invalidTrack).catch(error => {
        done()
      })
    })
  })
})
