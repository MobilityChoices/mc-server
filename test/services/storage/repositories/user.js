const { assert } = require('chai')
const sinon = require('sinon')
const userMock = require('../../../mocks/users/auth')
const ElasticClient = require('../../../../src/services/storage/client')
const userRepository = require('../../../../src/services/storage/repositories/user') // eslint-disable-line max-len

describe('user repository', () => {

  beforeEach(() => {
    sinon.stub(ElasticClient, 'request')
  })

  afterEach(() => {
    ElasticClient.request.restore()
  })

  describe('find', () => {
    it('calls Elastic client with proper path, data and method', () => {
      const userId = userMock.id
      const expectedPathArgument = `/users/default/${userId}`
      const expectedDataArgument = {}
      const expectedMethodArgument = 'GET'

      ElasticClient.request.returns(new Promise((resolve, reject) => resolve(userMock)))

      userRepository.find(userId)

      assert.isTrue(ElasticClient.request.calledWithMatch(
        expectedPathArgument,
        expectedDataArgument,
        expectedMethodArgument
      ))
    })
  })

  describe('findByEmail', () => {
    it('calls Elastic client with proper path, data and method', (done) => {
      const email = userMock.email
      const expectedPathArgument = '/users/default/_search'
      const expectedDataArgument = { query: { term: { email: email } } }
      const expectedMethodArgument = 'POST'

      ElasticClient.request.returns(new Promise((resolve, reject) => resolve([ userMock ])))

      userRepository.findByEmail(email).then(user => {
        assert.isTrue(ElasticClient.request.calledWithMatch(
          expectedPathArgument,
          expectedDataArgument,
          expectedMethodArgument
        ))
        done()
      })
    })
  })

  describe('all', () => {
    it('calls Elastic client with proper path, data and method', () => {
      const expectedPathArgument = `/users/default/`
      const expectedDataArgument = {}
      const expectedMethodArgument = 'GET'

      ElasticClient.request.returns(new Promise((resolve, reject) => resolve([userMock])))

      userRepository.all()

      assert.isTrue(ElasticClient.request.calledWithMatch(
        expectedPathArgument,
        expectedDataArgument,
        expectedMethodArgument
      ))
    })
  })

  describe('create', () => {
    it('calls Elastic client with proper path, data and method', () => {
      const expectedPathArgument = `/users/default/`
      const expectedDataArgument = userMock
      const expectedMethodArgument = 'POST'

      ElasticClient.request.returns(new Promise((resolve, reject) => resolve({ status: 'ok' })))

      userRepository.create(userMock)

      assert.isTrue(ElasticClient.request.calledWithMatch(
        expectedPathArgument,
        expectedDataArgument,
        expectedMethodArgument
      ))
    })
  })

  describe('update', () => {
    const userId = 'qe31ad'

    it('calls Elastic client with proper path, data and method', () => {
      const userId = userMock.id
      const expectedPathArgument = `/users/default/${userId}`
      const expectedDataArgument = userMock
      const expectedMethodArgument = 'PUT'

      ElasticClient.request.returns(new Promise((resolve, reject) => resolve({ status: 'ok' })))

      userRepository.update(userId, userMock)

      assert.isTrue(ElasticClient.request.calledWithMatch(
        expectedPathArgument,
        expectedDataArgument,
        expectedMethodArgument
      ))
    })
  })

  describe('delete', () => {
    const userId = 'qe31ad'

    it('calls Elastic client with proper path, data and method', () => {
      const userId = userMock.id
      const expectedPathArgument = `/users/default/${userId}`
      const expectedDataArgument = {}
      const expectedMethodArgument = 'DELETE'

      ElasticClient.request.returns(new Promise((resolve, reject) => resolve({ status: 'ok' })))

      userRepository.delete(userId)

      assert.isTrue(ElasticClient.request.calledWithMatch(
        expectedPathArgument,
        expectedDataArgument,
        expectedMethodArgument
      ))
    })
  })
})
