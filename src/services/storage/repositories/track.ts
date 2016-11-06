import ElasticClient from '../client'

const trackRepository = {
  find: (id: string) => {
    return ElasticClient.request(`/tracks/default/${id}`, {}, 'GET')
  },

  all: () => {
    return ElasticClient.request(`/tracks/default/`, {}, 'GET')
  },

  create: (track: any) => {
    return ElasticClient.request(`/tracks/default/`, track, 'POST')
  },

  update: (id: string, track: any) => {
    return ElasticClient.request(`/tracks/default/${id}`, track, 'PUT')
  },

  delete: (id: string) => {
    return ElasticClient.request(`/tracks/default/${id}`, {}, 'DELETE')
  }
}

module.exports = trackRepository
