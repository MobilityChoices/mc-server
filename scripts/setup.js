const ElasticClient = require('../src/services/storage/client')

const INDEX_SETTINGS = {
  index: {
    number_of_shards: 5,
    number_of_replicas: 0,
  }
}

const deleteIndex = (indexName) => ElasticClient.request(
  `/${indexName}/`,
  {},
  'DELETE'
)

const createIndex = (indexName, config) => ElasticClient.request(
  `/${indexName}/`,
  config,
  'POST'
)

const deleteAndCreateIndex = (indexName, config) => {
  ElasticClient.request(`/${indexName}/`, {}, 'HEAD').then(_ => {
    deleteIndex(indexName).then(_ => {
      createIndex(indexName, config)
    }).catch(_ => { })
  }).catch(_ => {
    createIndex(indexName, config)
  })
}

//-- TRACKS --------------------------------------------------------------------

const tracksIndex = {
  settings: INDEX_SETTINGS,
  mappings: {
    default: {
      properties: {
        created: { type: 'date', format: 'strict_date_optional_time||epoch_millis' },
        owner: { type: 'string' },
        locations: {
          type: 'nested',
          dynamic: 'strict',
          properties: {
            location: { type: 'geo_point' },
            time: { type: 'date', format: 'strict_date_optional_time||epoch_millis' },
          }
        }
      }
    }
  }
}

deleteAndCreateIndex('tracks', tracksIndex)



//-- USERS ---------------------------------------------------------------------

const usersIndex = {
  settings: INDEX_SETTINGS,
  mappings: {
    default: {
      _all: { enabled: false },
      properties: {
        activated: { type: 'boolean' },
        activationCode: { type: 'string' },
        created: { type: 'date', format: 'strict_date_optional_time||epoch_millis' },
        email: { type: 'string' },
        password: { type: 'string' },
      }
    }
  }
}

deleteAndCreateIndex('users', usersIndex)