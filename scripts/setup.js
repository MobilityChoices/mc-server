const ElasticClient = require('../dist/src/services/storage/client').default

const INDEX_SETTINGS = {
  index: {
    number_of_shards: 5,
    number_of_replicas: 0,
  }
}

const DATE_TIME_FORMAT = 'strict_date_optional_time||epoch_millis'

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
  deleteIndex(indexName)
    .then(() => createIndex(indexName, config))
    .catch(() => createIndex(indexName, config))
    .catch(e => console.log(e.response.data))
}

//-- TRACKS --------------------------------------------------------------------

const tracksIndex = {
  settings: INDEX_SETTINGS,
  mappings: {
    default: {
      properties: {
        created: {
          type: 'date',
          format: DATE_TIME_FORMAT
        },
        owner: {
          type: 'string',
          index: 'not_analyzed'
        },
        locations: {
          type: 'nested',
          dynamic: 'strict',
          properties: {
            location: { type: 'geo_point' },
            time: {
              type: 'date',
              format: DATE_TIME_FORMAT
            },
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
        email: { type: 'string', index: 'not_analyzed' },
        password: { type: 'string', index: 'not_analyzed' },
      }
    }
  }
}

deleteAndCreateIndex('users', usersIndex)
