const ElasticClient = require('../../elastic/client')

const trackRepository = {
  find: (id) => {
    return ElasticClient.request(`/tracks/default/${id}`, {}, 'GET')
  },

  all: () => {
    return ElasticClient.request(`/tracks/default/`, {}, 'GET')
  },

  create: (track) => {
    return ElasticClient.request(`/tracks/default/`, track, 'POST')
  },

  update: (id, track) => {
    return ElasticClient.request(`/tracks/default/${id}`, track, 'PUT')
  },

  delete: (id) => {
    return ElasticClient.request(`/tracks/default/${id}`, {}, 'DELETE')
  }
}

module.exports = trackRepository
