const { assert } = require('chai')
const sinon = require('sinon')
const axios = require('axios')
const qs = require('qs')
const ElasticClient = require('../../../src/services/storage/client')

const responseData = {
  data: [{ a: 1 }, { a: 2 }]
}

describe('ElasticClient', () => {
  const exampleData = { a: 'abc', b: '2' }

  beforeEach(() => {
    sinon.stub(axios, 'request')
    axios.request.returns(new Promise((resolve, reject) => resolve({ data: responseData })))
  })

  afterEach(() => {
    axios.request.restore()
  })

  describe('request', () => {
    it('returns a promise', () => {
      assert.instanceOf(ElasticClient.request(), Promise)
    })

    it('defaults to GET', (done) => {
      ElasticClient.request('/path').then(response => {
        assert.isTrue(axios.request.calledWithMatch({
          method: 'GET',
        }))
        done()
      })
    })

    it('respects the method argument', (done) => {
      ElasticClient.request('/path', exampleData, 'POST').then(response => {
        assert.isTrue(axios.request.calledWithMatch({
          method: 'POST',
        }))
        done()
      })
    })

    context('successful response', () => {
      it('resolves to the "data" property of the raw response', (done) => {
        ElasticClient.request('/path', exampleData, 'POST').then(response => {
          assert.deepEqual(response, responseData)
          done()
        })
      })
    })

    context('GET', () => {
      it('sends a GET request', (done) => {
        ElasticClient.request('/path', exampleData, 'GET').then(response => {
          assert.isTrue(axios.request.calledWithMatch({
            method: 'GET',
          }))
          done()
        })
      })

      context('data is passed', () => {
        it('data is passed as query parameters', (done) => {
          ElasticClient.request('/path', exampleData, 'GET').then(response => {
            const url = axios.request.getCall(0).args[0].url
            const passedQueryParams = url.substring(url.indexOf('?') + 1)
            assert.deepEqual(qs.parse(passedQueryParams), exampleData)
            done()
          })
        })
      })
    })

    context('HEAD', () => {
      it('sends a HEAD request', (done) => {
        ElasticClient.request('/path', exampleData, 'HEAD').then(response => {
          assert.isTrue(axios.request.calledWithMatch({
            method: 'HEAD',
          }))
          done()
        })
      })
    })

    context('POST', () => {
      it('sends a POST request', (done) => {
        ElasticClient.request('/path', exampleData, 'POST').then(response => {
          assert.isTrue(axios.request.calledWithMatch({
            method: 'POST',
          }))
          done()
        })
      })

      context('send data', () => {
        it('sends the data as payload', (done) => {
          ElasticClient.request('/path', exampleData, 'POST').then(response => {
            assert.isTrue(axios.request.calledWithMatch({
              data: exampleData,
            }))
            done()
          })
        })
      })
    })

    context('PUT', () => {
      it('sends a PUT request', (done) => {
        ElasticClient.request('/path', exampleData, 'PUT').then(response => {
          assert.isTrue(axios.request.calledWithMatch({
            method: 'PUT',
          }))
          done()
        })
      })
    })

    context('DELETE', () => {
      it('sends a DELETE request', (done) => {
        ElasticClient.request('/path', exampleData, 'DELETE').then(response => {
          assert.isTrue(axios.request.calledWithMatch({
            method: 'DELETE',
          }))
          done()
        })
      })
    })
  })
})
