const { assert } = require('chai')
const sinon = require('sinon')
const ElasticClient = require('../../../../src/services/elastic/client')
const userRepository = require('../../../../src/services/storage/repositories/user')

describe('user repository', () => {

  beforeEach(() => {
    sinon.stub(ElasticClient, 'request')
  })

  afterEach(() => {
    ElasticClient.request.restore()
  })

  describe('find', () => {
    const userId = 'qe31ad'

    it('calls Elastic client with proper path, data and method', () => {
      const expectedPathArgument = `/users/default/${userId}`
      const expectedDataArgument = {}
      const expectedMethodArgument = 'GET'

      userRepository.find(userId)

      assert.isTrue(ElasticClient.request.calledWithMatch(
        expectedPathArgument,
        expectedDataArgument,
        expectedMethodArgument
      ))
    })
  })

  describe('all', () => {
    it('calls Elastic client with proper path, data and method', () => {
      const expectedPathArgument = `/users/default/`
      const expectedDataArgument = {}
      const expectedMethodArgument = 'GET'

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
      const user = {
        email: 'max.mustermann@example.com',
        password: '$2a$10$UdA7ROqZWeVMz8L4MCBLiOSQTJAj6jWUpShctJ9.U.iy1ak/15PYu'
      }

      const expectedPathArgument = `/users/default/`
      const expectedDataArgument = user
      const expectedMethodArgument = 'POST'

      userRepository.create(user)

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
      const user = {
        email: 'max.mustermann@example.com',
        password: '$2a$10$UdA7ROqZWeVMz8L4MCBLiOSQTJAj6jWUpShctJ9.U.iy1ak/15PYu'
      }

      const expectedPathArgument = `/users/default/${userId}`
      const expectedDataArgument = user
      const expectedMethodArgument = 'PUT'

      userRepository.update(userId, user)

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
      const expectedPathArgument = `/users/default/${userId}`
      const expectedDataArgument = {}
      const expectedMethodArgument = 'DELETE'

      userRepository.delete(userId)

      assert.isTrue(ElasticClient.request.calledWithMatch(
        expectedPathArgument,
        expectedDataArgument,
        expectedMethodArgument
      ))
    })
  })
})
