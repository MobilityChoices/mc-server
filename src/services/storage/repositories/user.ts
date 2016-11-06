import ElasticClient from '../client'
import * as _ from 'lodash'
import * as Boom from 'boom'

const userRepository = {
  find: (id: string) => {
    return ElasticClient.request(`/users/default/${id}`, {}, 'GET')
  },

  findByEmail: (email: string) => {
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

  create: (user: any) => {
    return ElasticClient.request(`/users/default/`, user, 'POST')
  },

  update: (id: string, user: any) => {
    return ElasticClient.request(`/users/default/${id}`, user, 'PUT')
  },

  delete: (id: string) => {
    return ElasticClient.request(`/users/default/${id}`, {}, 'DELETE')
  }
}

module.exports = userRepository
