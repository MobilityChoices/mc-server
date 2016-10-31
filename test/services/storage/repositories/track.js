const { assert } = require('chai')
const sinon = require('sinon')
const trackMock = require('../../../mocks/track')
const ElasticClient = require('../../../../src/services/storage/client')
const trackRepository = require('../../../../src/services/storage/repositories/track') // eslint-disable-line max-len

describe('track repository', () => {

  beforeEach(() => {
    sinon.stub(ElasticClient, 'request')
  })

  afterEach(() => {
    ElasticClient.request.restore()
  })

  describe('find', () => {
    it('calls Elastic client with proper path, data and method', () => {
      const trackId = trackMock.id
      const expectedPathArgument = `/tracks/default/${trackId}`
      const expectedDataArgument = {}
      const expectedMethodArgument = 'GET'

      ElasticClient.request.returns(new Promise((resolve, reject) => resolve(trackMock)))

      trackRepository.find(trackId)

      assert.isTrue(ElasticClient.request.calledWithMatch(
        expectedPathArgument,
        expectedDataArgument,
        expectedMethodArgument
      ))
    })
  })

  describe('all', () => {
    it('calls Elastic client with proper path, data and method', () => {
      const expectedPathArgument = `/tracks/default/`
      const expectedDataArgument = {}
      const expectedMethodArgument = 'GET'

      ElasticClient.request.returns(new Promise((resolve, reject) => resolve([trackMock])))

      trackRepository.all()

      assert.isTrue(ElasticClient.request.calledWithMatch(
        expectedPathArgument,
        expectedDataArgument,
        expectedMethodArgument
      ))
    })
  })

  describe('create', () => {
    it('calls Elastic client with proper path, data and method', () => {
      const expectedPathArgument = `/tracks/default/`
      const expectedDataArgument = trackMock
      const expectedMethodArgument = 'POST'

      ElasticClient.request.returns(new Promise((resolve, reject) => resolve({ status: 'ok' })))

      trackRepository.create(trackMock)

      assert.isTrue(ElasticClient.request.calledWithMatch(
        expectedPathArgument,
        expectedDataArgument,
        expectedMethodArgument
      ))
    })
  })

  describe('update', () => {
    it('calls Elastic client with proper path, data and method', () => {
      const trackId = trackMock.id
      const expectedPathArgument = `/tracks/default/${trackId}`
      const expectedDataArgument = trackMock
      const expectedMethodArgument = 'PUT'

      ElasticClient.request.returns(new Promise((resolve, reject) => resolve({ status: 'ok' })))

      trackRepository.update(trackId, trackMock)

      assert.isTrue(ElasticClient.request.calledWithMatch(
        expectedPathArgument,
        expectedDataArgument,
        expectedMethodArgument
      ))
    })
  })

  describe('delete', () => {
    it('calls Elastic client with proper path, data and method', () => {
      const trackId = trackMock.id
      const expectedPathArgument = `/tracks/default/${trackId}`
      const expectedDataArgument = {}
      const expectedMethodArgument = 'DELETE'

      ElasticClient.request.returns(new Promise((resolve, reject) => resolve({ status: 'ok' })))

      trackRepository.delete(trackId)

      assert.isTrue(ElasticClient.request.calledWithMatch(
        expectedPathArgument,
        expectedDataArgument,
        expectedMethodArgument
      ))
    })
  })
})
