const { assert } = require('chai')
const server = require('../src/server')
const track = require('./mocks/track-raw')

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

  describe('/tracks', () => {
    describe('POST', () => {
      context('request succeeds', () => {
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

      context('request fails', () => {
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
})
