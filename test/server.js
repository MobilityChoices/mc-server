import { assert } from 'chai'
import * as Boom from 'boom'
import * as sinon from 'sinon'
const server = require('../src/server')
const track = require('./mocks/track-raw')
const userAuth = require('./mocks/users/auth')
const userDb = require('./mocks/users/db')
const userRepository = require('../src/services/storage/repositories/user')
const trackRepository = require('../src/services/storage/repositories/track')
import { token } from './mocks/auth'

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
        userRepository.create.returns(Promise.resolve(userAuth))
      })

      it('responds with 201', (done) => {
        server.inject({
          method: 'POST',
          url: '/auth/register',
          payload: userAuth,
        }, (response) => {
          assert.equal(response.statusCode, 201)
          done()
        })
      })
    })

    context('invalid data', () => {
      beforeEach(() => {
        userRepository.create.returns(Promise.resolve(userDb))
      })

      it('responds with 400', (done) => {
        server.inject({
          method: 'POST',
          url: '/auth/register',
          payload: Object.assign({}, userAuth, { email: undefined }),
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
          payload: userAuth,
        }, (response) => {
          assert.equal(response.statusCode, 500)
          done()
        })
      })
    })
  })

  describe('POST /auth/login', () => {
    beforeEach(() => {
      sinon.stub(userRepository, 'findByEmail')
    })

    afterEach(() => {
      userRepository.findByEmail.restore()
    })

    context('valid data (email, password)', () => {
      it('responds with status code 200', (done) => {
        userRepository.findByEmail.returns(Promise.resolve({ _id: '__ID__', data: userDb }))
        server.inject({
          method: 'POST',
          url: '/auth/login',
          payload: userAuth,
        }, (response) => {
          assert.equal(response.statusCode, 200)
          done()
        })
      })
    })
  })

  describe('POST /tracks', () => {

    beforeEach(() => {
      sinon.stub(trackRepository, 'create')
    })

    afterEach(() => {
      trackRepository.create.restore()
    })

    context('valid data', () => {
      beforeEach(() => {
        trackRepository.create.returns(Promise.resolve({}))
      })

      it('responds with status code 201', (done) => {
        server.inject({
          method: 'POST',
          url: '/tracks',
          headers: { 'Authorization': token },
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
          headers: { 'Authorization': token },
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
          headers: { 'Authorization': token },
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
          headers: { 'Authorization': token },
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
