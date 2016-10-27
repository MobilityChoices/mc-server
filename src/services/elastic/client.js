const axios = require('axios')
const qs = require('qs')
const elasticUrl = require('./elasticUrl')

const ElasticClient = {
  /**
   * @param {string} requestPath
   * @param {Object} data
   * @param {string} method
   */
  request: (requestPath = '', data = {}, method = 'GET') => {
    let payload = {}

    switch (method) {
      case 'GET':
        const requestParams = qs.stringify(data)
        if (requestParams.length > 0) {
          requestPath += `?${requestParams}`
        }
        break
      case 'POST':
      case 'PUT':
      case 'DELETE':
        if (data !== {}) {
          payload = data
        }
        break
    }

    return axios({
      method: method,
      url: elasticUrl(requestPath),
      data: payload,
    }).then(response => response.data)
  }
}

ElasticClient.request()

module.exports = ElasticClient
