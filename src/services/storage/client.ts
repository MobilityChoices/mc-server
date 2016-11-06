import * as axios from 'axios'
import * as qs from 'qs'
import elasticUrl from './elasticUrl'

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
      case 'HEAD':
        const requestParams = qs.stringify(data)
        if (requestParams.length > 0) {
          requestPath += `?${requestParams}`
        }
        break
      case 'POST':
      case 'PUT':
      case 'DELETE':
        payload = data
        break
    }

    return axios.request({
      method: method,
      url: elasticUrl(requestPath),
      data: payload,
    }).then(response => response.data)
  }
}

export default ElasticClient
