import { assert } from 'chai'
import * as sinon from 'sinon'
import repository from '../../../../src/services/storage/repository'
import userRepository from '../../../../src/services/storage/repositories/user'

describe('userRepository', () => {
  const user = { email: 'a@b.c', password: 'a-z0-9' }

  beforeEach(() => {
    sinon.stub(repository, 'create')
    const create = repository.create as sinon.SinonStub
    create.returns(Promise.resolve({ _id: 'Response%id' }))

    sinon.stub(repository, 'find')
    const find = repository.find as sinon.SinonStub
    find.returns(Promise.resolve({ _id: 'Response%id' }))

    sinon.stub(repository, 'query')
    const query = repository.query as sinon.SinonStub
    query.returns(Promise.resolve({ hits: { hits: [{ _id: '__ID__' }] } }))
  })

  afterEach(() => {
    const methods = [
      repository.create as sinon.SinonStub,
      repository.find as sinon.SinonStub,
      repository.query as sinon.SinonStub,
    ]
    methods.forEach(m => m.restore())
  })

  describe('create', () => {
    it('is a method', () => {
      assert.isFunction(userRepository.create)
    })

    it('returns a Promise', () => {
      assert.instanceOf(userRepository.create(user), Promise)
    })

    it('calls repository.create with proper index, type, and data', () => {
      userRepository.create(user)

      const create = repository.create as sinon.SinonStub
      assert.isTrue(create.calledWith('users', 'default', user))
    })
  })

  describe('find', () => {
    it('is a method', () => {
      assert.isFunction(userRepository.find)
    })

    it('returns a promise', () => {
      assert.instanceOf(userRepository.find('id'), Promise)
    })
  })

  describe('findByEmail', () => {
    it('is a method', () => {
      assert.isFunction(userRepository.findByEmail)
    })

    it('returns a Promise', () => {
      assert.instanceOf(userRepository.findByEmail('a@b.c'), Promise)
    })

    context('user with this email exists', () => {
      it('resolves the user', (done) => {
        userRepository.findByEmail('a@b.c')
          .then(value => {
            done()
          })
      })
    })

    context('no user with this email exists', () => {
      beforeEach(() => {
        const query = repository.query as sinon.SinonStub
        query.returns(Promise.resolve({ hits: { hits: [] } }))
      })

      it('rejects', (done) => {
        userRepository.findByEmail('x@y.z')
          .catch(err => {
            done()
          })
      })
    })
  })
})
