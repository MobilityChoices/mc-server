import { assert } from 'chai'
import { Server } from 'hapi'
import * as sinon from 'sinon'
import userDocument from './fixtures/userDocument'
import token from './fixtures/token'
import createServer from '../src/server'
import userRepository from '../src/services/storage/repositories/user'
import trackRepository from '../src/services/storage/repositories/track'

describe('server', () => {
  let userRepository$Create: sinon.SinonStub
  let userRepository$FindByEmail: sinon.SinonStub
  let trackRepository$Create: sinon.SinonStub
  let server: Server

  before(() => {
    server = createServer(6593, true)
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
        sinon.stub(userRepository, 'findByEmail')
        userRepository$FindByEmail = userRepository.findByEmail as sinon.SinonStub
        userRepository$FindByEmail.resolves(undefined)
      })

      afterEach(() => {
        userRepository$Create.restore()
        userRepository$FindByEmail.restore()
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

    context('email already used', () => {
      beforeEach(() => {
        sinon.stub(userRepository, 'create')
        userRepository$Create = userRepository.create as sinon.SinonStub
        userRepository$Create.returns(Promise.resolve('__ID__'))
        sinon.stub(userRepository, 'findByEmail')
        userRepository$FindByEmail = userRepository.findByEmail as sinon.SinonStub
        userRepository$FindByEmail.resolves(userDocument)
      })

      afterEach(() => {
        userRepository$Create.restore()
        userRepository$FindByEmail.restore()
      })

      const request = {
        method: 'POST',
        url: '/auth/register',
        payload: {
          email: 'alpha@beta.gamma',
          password: 'abcdefg',
        }
      }

      it('responds with status code 400', (done) => {
        server.inject(request, (response) => {
          assert.equal(response.statusCode, 400)
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
        userRepository$Create.rejects(new Error('server error'))()
        sinon.stub(userRepository, 'findByEmail')
        userRepository$FindByEmail = userRepository.findByEmail as sinon.SinonStub
        userRepository$FindByEmail.resolves(undefined)
      })

      afterEach(() => {
        userRepository$Create.restore()
        userRepository$FindByEmail.restore()
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

  describe('POST /auth/login', () => {
    let user$findByEmail: sinon.SinonStub

    context('valid data', () => {
      beforeEach(() => {
        sinon.stub(userRepository, 'findByEmail')
        user$findByEmail = userRepository.findByEmail as sinon.SinonStub
        user$findByEmail.returns(Promise.resolve(userDocument))
      })

      afterEach(() => {
        user$findByEmail.restore()
      })

      const request = {
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'alpha@beta.gamma',
          password: 'abcdefg',
        }
      }

      it('responds with status code 200', (done) => {
        server.inject(request, (response) => {
          assert.equal(response.statusCode, 200)
          done()
        })
      })

      it('returns a token', (done) => {
        server.inject(request, (response) => {
          const body = JSON.parse(response.payload)
          assert.isDefined(body.token)
          assert.isString(body.token)
          done()
        })
      })
    })

    context('missing email', () => {
      beforeEach(() => {
        sinon.stub(userRepository, 'findByEmail')
        user$findByEmail = userRepository.findByEmail as sinon.SinonStub
        user$findByEmail.returns(Promise.resolve(userDocument))
      })

      afterEach(() => {
        user$findByEmail.restore()
      })

      const request = {
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
        url: '/auth/login',
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

      it('returns an error', (done) => {
        server.inject(request, (response) => {
          const body = JSON.parse(response.payload)
          assert.equal(body.error.target, 'email')
          done()
        })
      })
    })

    context('invalid email', () => {
      beforeEach(() => {
        sinon.stub(userRepository, 'findByEmail')
        user$findByEmail = userRepository.findByEmail as sinon.SinonStub
        user$findByEmail.returns(Promise.resolve(userDocument))
      })

      afterEach(() => {
        user$findByEmail.restore()
      })

      const request = {
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: '@beta.gamma',
          password: 'abcdefg',
        }
      }

      it('responds with status code 400', (done) => {
        server.inject(request, (response) => {
          assert.equal(response.statusCode, 400)
          done()
        })
      })

      it('returns an error', (done) => {
        server.inject(request, (response) => {
          const body = JSON.parse(response.payload)
          assert.equal(body.error.target, 'email')
          done()
        })
      })
    })

    context('no user with this email', () => {
      beforeEach(() => {
        sinon.stub(userRepository, 'findByEmail')
        user$findByEmail = userRepository.findByEmail as sinon.SinonStub
        user$findByEmail.resolves(undefined)()
      })

      afterEach(() => {
        user$findByEmail.restore()
      })

      const request = {
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'alpha@beta.gamma',
          password: 'abcdefg',
        }
      }

      it('responds with status code 400', (done) => {
        server.inject(request, (response) => {
          assert.equal(response.statusCode, 400)
          done()
        })
      })

      it('returns an error', (done) => {
        server.inject(request, (response) => {
          const body = JSON.parse(response.payload)
          assert.isDefined(body.error)
          done()
        })
      })
    })

    context('missing password', () => {
      beforeEach(() => {
        sinon.stub(userRepository, 'findByEmail')
        user$findByEmail = userRepository.findByEmail as sinon.SinonStub
        user$findByEmail.returns(Promise.resolve(userDocument))
      })

      afterEach(() => {
        user$findByEmail.restore()
      })

      const request = {
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
        url: '/auth/login',
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
          assert.isDefined(body.error)
          done()
        })
      })
    })

    context('invalid password', () => {
      beforeEach(() => {
        sinon.stub(userRepository, 'findByEmail')
        user$findByEmail = userRepository.findByEmail as sinon.SinonStub
        user$findByEmail.returns(Promise.resolve(userDocument))
      })

      afterEach(() => {
        user$findByEmail.restore()
      })

      const request = {
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'alpha@beta.gamma',
          password: 'ab_defg',
        }
      }

      it('responds with status code 400', (done) => {
        server.inject(request, (response) => {
          assert.equal(response.statusCode, 400)
          done()
        })
      })

      it('returns an error', (done) => {
        server.inject(request, (response) => {
          const body = JSON.parse(response.payload)
          assert.isDefined(body.error)
          done()
        })
      })
    })

    context('server error', () => {
      beforeEach(() => {
        sinon.stub(userRepository, 'findByEmail')
        user$findByEmail = userRepository.findByEmail as sinon.SinonStub
        user$findByEmail.rejects(new Error('server error'))()
      })

      afterEach(() => {
        user$findByEmail.restore()
      })

      const request = {
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
        url: '/auth/login',
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

      it('returns an error', (done) => {
        server.inject(request, (response) => {
          const body = JSON.parse(response.payload)
          assert.isDefined(body.error)
          done()
        })
      })
    })
  })

  describe('GET /me', () => {
    let user$find: sinon.SinonStub

    context('valid data', () => {
      beforeEach(() => {
        sinon.stub(userRepository, 'find')
        user$find = userRepository.find as sinon.SinonStub
        user$find.resolves(userDocument)
      })

      afterEach(() => {
        user$find.restore()
      })

      const request = {
        headers: {
          'Authorization': token,
        },
        method: 'GET',
        url: '/me',
      }

      it('responds with status code 200', (done) => {
        server.inject(request, (response) => {
          assert.equal(response.statusCode, 200)
          done()
        })
      })

      it('returns the profile', (done) => {
        server.inject(request, (response) => {
          const body = JSON.parse(response.payload)
          assert.isDefined(body.email)
          done()
        })
      })
    })

    context('missing authorization token', () => {
      beforeEach(() => {
        sinon.stub(userRepository, 'find')
        user$find = userRepository.find as sinon.SinonStub
        user$find.resolves(userDocument)
      })

      afterEach(() => {
        user$find.restore()
      })

      const request = {
        headers: {},
        method: 'GET',
        url: '/me',
      }

      it('responds with status code 401', (done) => {
        server.inject(request, (response) => {
          assert.equal(response.statusCode, 401)
          done()
        })
      })

      it('returns an error', (done) => {
        server.inject(request, (response) => {
          const body = JSON.parse(response.payload)
          assert.isDefined(body.error)
          done()
        })
      })
    })

    context('user not found', () => {
      beforeEach(() => {
        sinon.stub(userRepository, 'find')
        user$find = userRepository.find as sinon.SinonStub
        user$find.resolves(undefined)
      })

      afterEach(() => {
        user$find.restore()
      })

      const request = {
        headers: {
          'Authorization': token,
        },
        method: 'GET',
        url: '/me',
      }

      it('responds with status code 400', (done) => {
        server.inject(request, (response) => {
          assert.equal(response.statusCode, 400)
          done()
        })
      })

      it('returns an error', (done) => {
        server.inject(request, (response) => {
          const body = JSON.parse(response.payload)
          assert.isDefined(body.error)
          done()
        })
      })
    })

    context('server error', () => {
      beforeEach(() => {
        sinon.stub(userRepository, 'find')
        user$find = userRepository.find as sinon.SinonStub
        user$find.rejects(new Error('server error'))()
      })

      afterEach(() => {
        user$find.restore()
      })

      const request = {
        headers: {
          'Authorization': token,
        },
        method: 'GET',
        url: '/me',
      }

      it('responds with status code 500', (done) => {
        server.inject(request, (response) => {
          assert.equal(response.statusCode, 500)
          done()
        })
      })

      it('returns an error', (done) => {
        server.inject(request, (response) => {
          const body = JSON.parse(response.payload)
          assert.isDefined(body.error)
          done()
        })
      })
    })
  })

  describe('POST /tracks', () => {
    context('valid data', () => {
      beforeEach(() => {
        sinon.stub(trackRepository, 'create')
        trackRepository$Create = trackRepository.create as sinon.SinonStub
        trackRepository$Create.resolves('__ID__')
      })

      afterEach(() => {
        trackRepository$Create.restore()
      })

      const request = {
        headers: {
          'Authorization': token,
        },
        method: 'POST',
        payload: {
          locations: [
            {
              latitude: 47.11,
              longitude: 23.555,
              time: '2016-11-13T13:34:56',
            }
          ]
        },
        url: '/tracks',
      }

      it('responds with status code 201', (done) => {
        server.inject(request, (response) => {
          assert.equal(response.statusCode, 201)
          done()
        })
      })
    })

    context('unauthorized', () => {
      beforeEach(() => {
        sinon.stub(trackRepository, 'create')
        trackRepository$Create = trackRepository.create as sinon.SinonStub
        trackRepository$Create.resolves('__ID__')
      })

      afterEach(() => {
        trackRepository$Create.restore()
      })

      const request = {
        headers: {},
        method: 'POST',
        payload: {
          locations: [
            {
              latitude: 47.11,
              longitude: 23.555,
              time: '2016-11-13T13:34:56',
            }
          ]
        },
        url: '/tracks',
      }

      it('responds with status code 401', (done) => {
        server.inject(request, (response) => {
          assert.equal(response.statusCode, 401)
          done()
        })
      })

      it('returns an error', (done) => {
        server.inject(request, (response) => {
          const body = JSON.parse(response.payload)
          assert.isDefined(body.error)
          done()
        })
      })
    })

    context('invalid track', () => {
      beforeEach(() => {
        sinon.stub(trackRepository, 'create')
        trackRepository$Create = trackRepository.create as sinon.SinonStub
        trackRepository$Create.resolves('__ID__')
      })

      afterEach(() => {
        trackRepository$Create.restore()
      })

      const request = {
        headers: {
          'Authorization': token
        },
        method: 'POST',
        payload: {},
        url: '/tracks',
      }

      it('responds with status code 400', (done) => {
        server.inject(request, (response) => {
          assert.equal(response.statusCode, 400)
          done()
        })
      })

      it('returns an error', (done) => {
        server.inject(request, (response) => {
          const body = JSON.parse(response.payload)
          assert.isDefined(body.error)
          done()
        })
      })
    })

    context('server error', () => {
      beforeEach(() => {
        sinon.stub(trackRepository, 'create')
        trackRepository$Create = trackRepository.create as sinon.SinonStub
        trackRepository$Create.rejects(new Error('server error'))()
      })

      afterEach(() => {
        trackRepository$Create.restore()
      })

      const request = {
        headers: {
          'Authorization': token
        },
        method: 'POST',
        payload: {
          locations: [
            {
              latitude: 47.11,
              longitude: 23.555,
              time: '2016-11-13T13:34:56',
            }
          ]
        },
        url: '/tracks',
      }

      it('responds with status code 500', (done) => {
        server.inject(request, (response) => {
          assert.equal(response.statusCode, 500)
          done()
        })
      })

      it('returns an error', (done) => {
        server.inject(request, (response) => {
          const body = JSON.parse(response.payload)
          assert.isDefined(body.error)
          done()
        })
      })
    })
  })
})
