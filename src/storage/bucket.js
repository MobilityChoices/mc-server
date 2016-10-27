const ElasticClient = require('../services/elastic/client')

/**
 * @typedef {Object} BucketOptions
 * @property {string} index
 * @property {string} type
 */

/**
 * @param {BucketOptions} options
 */
const Bucket = (options) => {
  return {
    /**
     * Add a new document to the storage.
     *
     * @param {Object} value - the document
     */
    index: (value) => {
      const requestPath = `/${options.index}/${options.type}/`
      const requestPayload = value
      return ElasticClient.request(requestPath, requestPayload, 'POST')
    },

    /**
     * Retrieve a document from the storage.
     *
     * @param {string} id - the document‘s id
     */
    get: (id) => {
      const requestPath = `/${options.index}/${options.type}/${id}`
      return ElasticClient.request(requestPath, {}, 'GET')
    },

    /**
     * Update a document in the storage.
     *
     * @param {string} id - the document‘s id
     * @param {Object} value - the document‘s new value
     */
    update: (id, value) => {
      const requestPath = `/${options.index}/${options.type}/${id}`
      const requestPayload = value
      return ElasticClient.request(requestPath, requestPayload, 'PUT')
    },

    /**
     * Delete a document from the storage.
     *
     * @param {string} id - the document‘s id
     */
    delete: (id) => {
      const requestPath = `/${options.index}/${options.type}/${id}`
      return ElasticClient.request(requestPath, {}, 'DELETE')
    }
  }
}

module.exports = Bucket
