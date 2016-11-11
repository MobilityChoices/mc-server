import { assert } from 'chai'
import * as sinon from 'sinon'
import ElasticClient from '../../../src/services/storage/client'
import repository from '../../../src/services/storage/repository'

describe('repository', () => {
  beforeEach(() => {
    sinon.stub(ElasticClient, 'request')
  })

  afterEach(() => {
    (ElasticClient.request as sinon.SinonStub).restore()
  })

  describe('create', () => {
    beforeEach(() => {
      (ElasticClient.request as sinon.SinonStub).returns(Promise.resolve({ _id: 'Response%id' }))
    })

    it('is a method', () => {
      assert.isFunction(repository.create)
    })

    it('returns a Promise', () => {
      assert.instanceOf(repository.create('index', 'type', {}), Promise)
    })

    it('calls Elastic client with proper path, data, and method', () => {
      repository.create('index', 'type', {})

      const request = ElasticClient.request as sinon.SinonStub
      assert.isTrue(request.calledWithMatch('/index/type/', {}, 'POST'))
    })

    context('request succeeds', () => {
      beforeEach(() => {
        (ElasticClient.request as sinon.SinonStub).returns(Promise.resolve({ _id: 'Response%id' }))
      })

      it('resolves', (done) => {
        repository.create('index', 'type', {})
          .then(value => {
            done()
          })
      })
    })

    context('request fails', () => {
      beforeEach(() => {
        (ElasticClient.request as sinon.SinonStub).returns(Promise.reject({}))
      })

      it('rejects', (done) => {
        repository.create('index', 'type', {})
          .catch(err => {
            done()
          })
      })
    })
  })

  describe('find', () => {
    beforeEach(() => {
      (ElasticClient.request as sinon.SinonStub).returns(Promise.resolve({ _id: 'Response%id' }))
    })

    it('is a method', () => {
      assert.isFunction(repository.find)
    })

    it('returns a Promise', () => {
      assert.instanceOf(repository.find('index', 'type', 'id'), Promise)
    })

    it('calls Elastic client with proper path, data, and method', () => {
      repository.find('index', 'type', 'id')

      const request = ElasticClient.request as sinon.SinonStub
      assert.isTrue(request.calledWithMatch('/index/type/id', {}, 'GET'))
    })

    context('request succeeds', () => {
      beforeEach(() => {
        (ElasticClient.request as sinon.SinonStub).returns(Promise.resolve({ _id: 'Response%id' }))
      })

      it('resolves', (done) => {
        repository.find('index', 'type', 'id')
          .then(value => {
            done()
          })
      })
    })

    context('request fails', () => {
      beforeEach(() => {
        (ElasticClient.request as sinon.SinonStub).returns(Promise.reject({}))
      })

      it('rejects', (done) => {
        repository.find('index', 'type', 'id')
          .catch(err => {
            done()
          })
      })
    })
  })

  describe('query', () => {
    beforeEach(() => {
      (ElasticClient.request as sinon.SinonStub).returns(Promise.resolve({ hits: { hits: [] } }))
    })

    it('is a method', () => {
      assert.isFunction(repository.query)
    })

    it('returns a Promise', () => {
      assert.instanceOf(repository.query('index', 'type', {}), Promise)
    })

    it('calls Elastic client with proper path, data, and method', () => {
      repository.query('index', 'type', {})

      const request = ElasticClient.request as sinon.SinonStub
      assert.isTrue(request.calledWithMatch('/index/type/_search', {}, 'POST'))
    })

    context('request succeeds', () => {
      beforeEach(() => {
        (ElasticClient.request as sinon.SinonStub).returns(Promise.resolve({ hits: { hits: [] } }))
      })

      it('resolves', (done) => {
        repository.query('index', 'type', {})
          .then(value => {
            done()
          })
      })
    })

    context('request fails', () => {
      beforeEach(() => {
        (ElasticClient.request as sinon.SinonStub).returns(Promise.reject({}))
      })

      it('rejects', (done) => {
        repository.query('index', 'type', {})
          .catch(err => {
            done()
          })
      })
    })
  })
})
