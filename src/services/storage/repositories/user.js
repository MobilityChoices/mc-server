const ElasticClient = require('../client')
const _ = require('lodash')

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
        const hits = _.get(response, 'hits.hits', [])
        if (hits.length) {
          return Object.assign({}, { _id: hits[0]._id, data: hits[0]._source })
        }
        return null
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
