const { assert } = require('chai')
const sinon = require('sinon')
const axios = require('axios')
const qs = require('qs')
const ElasticClient = require('../../../src/services/storage/client')

const responseData = {
  data: [{ a: 1 }, { a: 2 }]
}

describe('ElasticClient', () => {
  beforeEach(() => {
    sinon.stub(axios, 'request')
    axios.request.returns(new Promise((resolve, reject) => ({ data: responseData })))
  })

  afterEach(() => {
    axios.request.restore()
  })

  describe('request', () => {
    it('returns a promise', () => {
      assert.instanceOf(ElasticClient.request(), Promise)
    })

    // it('resolves to the "data" property of the response', (done) => {
    //   ElasticClient.request().then(d => {
    //     assert.deepEqual(d, responseData)
    //     done()
    //   }).catch(err => {
    //     done()
    //   })
    // })

    context('GET', () => {
      it('sends a GET request', () => {
        ElasticClient.request('/path', {}, 'GET')
        assert.isTrue(axios.request.calledWithMatch({
          method: 'GET',
        }))
      })

      context('data is passed', () => {
        it('data is passed as query parameters', () => {
          const data = { prop: 'value' }
          ElasticClient.request('/path', data, 'GET')
          const url = axios.request.getCall(0).args[0].url
          const passedQueryParams = url.substring(url.indexOf('?') + 1)
          assert.deepEqual(qs.parse(passedQueryParams), data)
        })
      })
    })

    context('HEAD', () => {
      it('sends a HEAD request', () => {
        ElasticClient.request('/path', {}, 'HEAD')
        assert.isTrue(axios.request.calledWithMatch({
          method: 'HEAD',
        }))
      })
    })

    context('POST', () => {
      it('sends a POST request', () => {
        ElasticClient.request('/path', {}, 'POST')
        assert.isTrue(axios.request.calledWithMatch({
          method: 'POST',
        }))
      })
    })

    context('PUT', () => {
      it('sends a PUT request', () => {
        ElasticClient.request('/path', {}, 'PUT')
        assert.isTrue(axios.request.calledWithMatch({
          method: 'PUT',
        }))
      })
    })

    context('DELETE', () => {
      it('sends a DELETE request', () => {
        ElasticClient.request('/path', {}, 'DELETE')
        assert.isTrue(axios.request.calledWithMatch({
          method: 'DELETE',
        }))
      })
    })
  })
})
