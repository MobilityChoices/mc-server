const { assert } = require('chai')
const sinon = require('sinon')
const ElasticClient = require('../../../../src/services/elastic/client')
const trackRepository = require('../../../../src/services/storage/repositories/track')

describe('track repository', () => {

  beforeEach(() => {
    sinon.stub(ElasticClient, 'request')
  })

  afterEach(() => {
    ElasticClient.request.restore()
  })

  describe('find', () => {
    const trackId = 'qe31ad'

    it('calls Elastic client with proper path, data and method', () => {
      const expectedPathArgument = `/tracks/default/${trackId}`
      const expectedDataArgument = {}
      const expectedMethodArgument = 'GET'

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
      const track = {
        time: '2016-10-28 13:39:42',
        locations: [
          { lat: 23.45, lng: 47.91 }
        ]
      }

      const expectedPathArgument = `/tracks/default/`
      const expectedDataArgument = track
      const expectedMethodArgument = 'POST'

      trackRepository.create(track)

      assert.isTrue(ElasticClient.request.calledWithMatch(
        expectedPathArgument,
        expectedDataArgument,
        expectedMethodArgument
      ))
    })
  })

  describe('update', () => {
    const trackId = 'qe31ad'

    it('calls Elastic client with proper path, data and method', () => {
      const track = {
        time: '2016-10-28 13:39:42',
        locations: [
          { lat: 23.45, lng: 47.91 }
        ]
      }

      const expectedPathArgument = `/tracks/default/${trackId}`
      const expectedDataArgument = track
      const expectedMethodArgument = 'PUT'

      trackRepository.update(trackId, track)

      assert.isTrue(ElasticClient.request.calledWithMatch(
        expectedPathArgument,
        expectedDataArgument,
        expectedMethodArgument
      ))
    })
  })

  describe('delete', () => {
    const trackId = 'qe31ad'

    it('calls Elastic client with proper path, data and method', () => {
      const expectedPathArgument = `/tracks/default/${trackId}`
      const expectedDataArgument = {}
      const expectedMethodArgument = 'DELETE'

      trackRepository.delete(trackId)

      assert.isTrue(ElasticClient.request.calledWithMatch(
        expectedPathArgument,
        expectedDataArgument,
        expectedMethodArgument
      ))
    })
  })
})
