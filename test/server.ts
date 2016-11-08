import { assert } from 'chai'
import { Server } from 'hapi'
import * as sinon from 'sinon'
import createServer from '../src/server'
import userRepository from '../src/services/storage/repositories/user'


describe('server', () => {
  let userRepository$Create: sinon.SinonStub
  let server: Server

  before(() => {
    server = createServer(6593)
  })

  after(() => {
    server.stop()
  })

  describe('POST /auth/register', () => {
    context('valid data', () => {
      beforeEach(() => {
        sinon.stub(userRepository, 'create')
        userRepository$Create = userRepository.create as sinon.SinonStub
        userRepository$Create.returns(Promise.resolve('__ID__'))
      })

      afterEach(() => {
        userRepository$Create.restore()
      })

      const request = {
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
        url: '/auth/register',
        payload: {
          email: 'alpha@beta.gamma',
          password: 'abcdefg',
        }
      }

      it('responds with status code 201', (done) => {
        server.inject(request, (response) => {
          assert.equal(response.statusCode, 201)
          done()
        })
      })

      it('responds with an empty body', (done) => {
        server.inject(request, (response) => {
          assert.equal(response.payload, '')
          done()
        })
      })
    })

    context('missing email', () => {
      beforeEach(() => {
        sinon.stub(userRepository, 'create')
        userRepository$Create = userRepository.create as sinon.SinonStub
        userRepository$Create.returns(Promise.resolve('__ID__'))
      })

      afterEach(() => {
        userRepository$Create.restore()
      })

      const request = {
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
        url: '/auth/register',
        payload: {
          password: 'abcdefg',
        }
      }

      it('responds with status code 400', (done) => {
        server.inject(request, (response) => {
          assert.equal(response.statusCode, 400)
          done()
        })
      })

      it('responds with an error', (done) => {
        server.inject(request, (response) => {
          const body = JSON.parse(response.payload)
          assert.equal(body.error.target, 'email')
          done()
        })
      })
    })

    context('incorrect email', () => {
      beforeEach(() => {
        sinon.stub(userRepository, 'create')
        userRepository$Create = userRepository.create as sinon.SinonStub
        userRepository$Create.returns(Promise.resolve('__ID__'))
      })

      afterEach(() => {
        userRepository$Create.restore()
      })

      const request = {
        method: 'POST',
        url: '/auth/register',
        payload: {
          email: '@beta',
          password: 'abcdefg',
        }
      }

      it('responds with status code 400', (done) => {
        server.inject(request, (response) => {
          assert.equal(response.statusCode, 400)
          done()
        })
      })

      it('responds with an error', (done) => {
        server.inject(request, (response) => {
          const body = JSON.parse(response.payload)
          assert.equal(body.error.target, 'email')
          done()
        })
      })
    })

    context('missing password', () => {
      beforeEach(() => {
        sinon.stub(userRepository, 'create')
        userRepository$Create = userRepository.create as sinon.SinonStub
        userRepository$Create.returns(Promise.resolve('__ID__'))
      })

      afterEach(() => {
        userRepository$Create.restore()
      })

      const request = {
        method: 'POST',
        url: '/auth/register',
        payload: {
          email: 'alpha@beta.gamma',
        }
      }

      it('responds with status code 400', (done) => {
        server.inject(request, (response) => {
          assert.equal(response.statusCode, 400)
          done()
        })
      })

      it('responds with an error', (done) => {
        server.inject(request, (response) => {
          const body = JSON.parse(response.payload)
          assert.equal(body.error.target, 'password')
          done()
        })
      })
    })

    context('invalid password', () => {
      beforeEach(() => {
        sinon.stub(userRepository, 'create')
        userRepository$Create = userRepository.create as sinon.SinonStub
        userRepository$Create.returns(Promise.resolve('__ID__'))
      })

      afterEach(() => {
        userRepository$Create.restore()
      })

      const request = {
        method: 'POST',
        url: '/auth/register',
        payload: {
          email: 'alpha@beta.gamma',
          password: 'abc',
        }
      }

      it('responds with status code 400', (done) => {
        server.inject(request, (response) => {
          assert.equal(response.statusCode, 400)
          done()
        })
      })

      it('responds with an error', (done) => {
        server.inject(request, (response) => {
          const body = JSON.parse(response.payload)
          assert.equal(body.error.target, 'password')
          done()
        })
      })
    })

    context('server error', () => {
      beforeEach(() => {
        sinon.stub(userRepository, 'create')
        userRepository$Create = userRepository.create as sinon.SinonStub
        userRepository$Create.returns(Promise.reject({}))
      })

      afterEach(() => {
        userRepository$Create.restore()
      })

      const request = {
        method: 'POST',
        url: '/auth/register',
        payload: {
          email: 'alpha@beta.gamma',
          password: 'abcdefg',
        }
      }

      it('responds with status code 500', (done) => {
        server.inject(request, (response) => {
          assert.equal(response.statusCode, 500)
          done()
        })
      })

      it('responds with an error', (done) => {
        server.inject(request, (response) => {
          const body = JSON.parse(response.payload)
          assert.equal(body.error.code, 'ServerError')
          done()
        })
      })
    })
  })
})
