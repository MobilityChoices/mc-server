const ElasticClient = require('../client')
const _ = require('lodash')
import * as Boom from 'boom'

const userRepository = {
  /**
   * @param {string} id
   */
  find: (id) => {
    return ElasticClient.request(`/users/default/${id}`, {}, 'GET')
  },

  /**
   * @param {string} email
   * @returns {Promise<Object>}
   */
  findByEmail: (email) => {
    const payload = {
      query: {
        term: {
          email: email
        }
      }
    }
    return ElasticClient.request('/users/default/_search', payload, 'POST')
      .then(response => {
        const firstHit = _.get(response, 'hits.hits[0]', null)
        if (!firstHit) {
          throw Boom.notFound('user not found')
        }
        return firstHit
      })
  },

  all: () => {
    return ElasticClient.request(`/users/default/`, {}, 'GET')
  },

  /**
   * @param {Object} user
   */
  create: (user) => {
    return ElasticClient.request(`/users/default/`, user, 'POST')
  },

  /**
   * @param {string} id
   * @param {Object} user
   */
  update: (id, user) => {
    return ElasticClient.request(`/users/default/${id}`, user, 'PUT')
  },

  /**
   * @param {string} id
   */
  delete: (id) => {
    return ElasticClient.request(`/users/default/${id}`, {}, 'DELETE')
  }
}

module.exports = userRepository
