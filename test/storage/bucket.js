const { assert } = require('chai')
const sinon = require('sinon')
const Bucket = require('../../src/storage/bucket')
const ElasticClient = require('../../src/services/elastic/client')

describe('Bucket', () => {

  beforeEach(() => {
    sinon.stub(ElasticClient, 'request')
  })

  afterEach(() => {
    ElasticClient.request.restore()
  })

  describe('index', () => {
    const expectedPathArgument = '/tracks/default/'
    const bucket = Bucket({ index: 'tracks', type: 'default' })

    it('calls the Elastic client with proper path, value and method', () => {
      const expectedDataArgument = {
        time: '2016-10-27 23:25:54'
      }

      bucket.index({ time: '2016-10-27 23:25:54' })

      assert.isTrue(ElasticClient.request.calledWithMatch(
        expectedPathArgument,
        expectedDataArgument,
        'POST'
      ))
    })
  })

  describe('get', () => {
    const expectedPathArgument = '/tracks/default/23'
    const bucket = Bucket({ index: 'tracks', type: 'default' })

    it('calls the Elastic client with proper path, value and method', () => {
      bucket.get(23)

      assert.isTrue(ElasticClient.request.calledWithMatch(
        expectedPathArgument,
        {},
        'GET'
      ))
    })
  })

  describe('update', () => {
    const expectedPathArgument = '/tracks/default/23'
    const bucket = Bucket({ index: 'tracks', type: 'default' })

    it('calls the Elastic client with proper path, value and method', () => {
      const expectedDataArgument = {
        time: '2016-10-27 23:25:54'
      }

      bucket.update(23, expectedDataArgument)

      assert.isTrue(ElasticClient.request.calledWithMatch(
        expectedPathArgument,
        expectedDataArgument,
        'PUT'
      ))
    })
  })

  describe('delete', () => {
    const expectedPathArgument = '/tracks/default/23'
    const bucket = Bucket({ index: 'tracks', type: 'default' })

    it('calls the Elastic client with proper path, value and method', () => {
      bucket.delete(23)

      assert.isTrue(ElasticClient.request.calledWithMatch(
        expectedPathArgument,
        {},
        'DELETE'
      ))
    })
  })

})
