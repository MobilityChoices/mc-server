const { assert } = require('chai')
const sinon = require('sinon')
const server = require('../src/server')
const track = require('./mocks/track-raw')
const user = require('./mocks/user-raw')
const userRepository = require('../src/services/storage/repositories/user')

describe('server', () => {

  beforeEach(() => {
    server.start((err) => {
      if (err) {
        throw err
      }
    })
  })

  afterEach(() => {
    server.stop()
  })

  describe('POST /auth/register', () => {

    beforeEach(() => {
      sinon.stub(userRepository, 'create')
    })

    afterEach(() => {
      userRepository.create.restore()
    })

    context('valid data (email, password)', () => {
      beforeEach(() => {
        userRepository.create.returns(Promise.resolve(user))
      })

      it('creates a new user', (done) => {
        server.inject({
          method: 'POST',
          url: '/auth/register',
          payload: user,
        }, (response) => {
          assert.isTrue(userRepository.create.calledWithMatch(user))
          done()
        })
      })

      it('responds with 201', (done) => {
        server.inject({
          method: 'POST',
          url: '/auth/register',
          payload: user,
        }, (response) => {
          assert.equal(response.statusCode, 201)
          done()
        })
      })

      it('returns the newly created user', (done) => {
        server.inject({
          method: 'POST',
          url: '/auth/register',
          payload: user,
        }, (response) => {
          const responseObj = JSON.parse(response.payload)
          assert.deepEqual(responseObj, user)
          done()
        })
      })
    })

    context('invalid data', () => {
      beforeEach(() => {
        userRepository.create.returns(Promise.resolve(user))
      })

      it('responds with 400', (done) => {
        server.inject({
          method: 'POST',
          url: '/auth/register',
          payload: Object.assign({}, user, { email: undefined }),
        }, (response) => {
          assert.equal(response.statusCode, 400)
          done()
        })
      })
    })

    context('valid data but storing fails', () => {
      beforeEach(() => {
        userRepository.create.returns(Promise.reject(new Error()))
      })

      it('responds with 500', (done) => {
        server.inject({
          method: 'POST',
          url: '/auth/register',
          payload: user,
        }, (response) => {
          assert.equal(response.statusCode, 500)
          done()
        })
      })
    })
  })

  describe('POST /tracks', () => {
    context('valid data', () => {
      it('responds with status code 201', (done) => {
        server.inject({
          method: 'POST',
          url: '/tracks',
          payload: track,
        }, (response) => {
          assert.equal(response.statusCode, 201)
          done()
        })
      })

      it('returns the newly created track', (done) => {
        server.inject({
          method: 'POST',
          url: '/tracks',
          payload: track,
        }, (response) => {
          const responseObj = JSON.parse(response.payload)
          assert.deepEqual(responseObj, track)
          done()
        })
      })
    })

    context('invalid data', () => {
      it('responds with status code 400', (done) => {
        server.inject({
          method: 'POST',
          url: '/tracks',
          payload: Object.assign({}, track, { owner: undefined }),
        }, (response) => {
          assert.equal(response.statusCode, 400)
          done()
        })
      })

      it('returns an error', (done) => {
        server.inject({
          method: 'POST',
          url: '/tracks',
          payload: Object.assign({}, track, { owner: undefined }),
        }, (response) => {
          const responseObj = JSON.parse(response.payload)
          assert.isObject(responseObj)
          done()
        })
      })
    })
  })
})
