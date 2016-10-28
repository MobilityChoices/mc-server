const ElasticClient = require('../../elastic/client')

const userRepository = {
  find: (id) => {
    return ElasticClient.request(`/users/default/${id}`, {}, 'GET')
  },

  all: () => {
    return ElasticClient.request(`/users/default/`, {}, 'GET')
  },

  create: (track) => {
    return ElasticClient.request(`/users/default/`, track, 'POST')
  },

  update: (id, track) => {
    return ElasticClient.request(`/users/default/${id}`, track, 'PUT')
  },

  delete: (id) => {
    return ElasticClient.request(`/users/default/${id}`, {}, 'DELETE')
  }
}

module.exports = userRepository
