import { assert } from 'chai'
import validate from '../../src/helpers/validate'
const schemas = require('../../src/helpers/schemas')
const track = require('../mocks/track-raw')
const user = require('../mocks/users/auth')
const invalidUser = require('../mocks/users/invalid')

const invalidTrack = Object.assign({}, track, { locations: undefined })

describe('validate', () => {
  it('returns a Promise', () => {
    assert.instanceOf(validate(track, schemas.track), Promise)
  })

  describe('track', () => {
    context('valid track', () => {
      it('resolves the validated track', (done) => {
        validate(track, schemas.track).then(validatedTrack => {
          assert.deepEqual(validatedTrack, track)
          done()
        })
      })
    })

    context('invalid track', () => {
      it('rejects', (done) => {
        validate(invalidTrack, schemas.track).catch(error => {
          done()
        })
      })
    })
  })

  describe('user', () => {
    context('valid user', () => {
      it('resolves the validated user', (done) => {
        validate(user, schemas.user).then(validatedUser => {
          assert.deepEqual(validatedUser, user)
          done()
        })
      })
    })

    context('invalid user', () => {
      it('rejects', (done) => {
        validate(invalidUser, schemas.user).catch(error => {
          done()
        })
      })
    })
  })
})
