import { assert } from 'chai'
import { Server } from 'hapi'
import * as sinon from 'sinon'
import createServer from '../src/server'
import userRepository from '../src/services/storage/repositories/user'

require('sinon-as-promised')(Promise)

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
        userRepository$Create.rejects(new Error('server error'))()
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

  const userDocument = {
    _index: 'users',
    _type: 'default',
    _id: '__ID__',
    _source: {
      email: 'alpha@beta.gamma',
      // tslint:disable-next-line: max-line-length
      password: 'af21c41de791b9be.845b99a241e7ef7e25152563d1fb2dbc5431a592c6b52b33ec8347652656aac16f201b5c571488d536981903cb884a19166bd36d6af1873a992cd3c37deda8d2',
    }
  }

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
})
