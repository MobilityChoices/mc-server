import * as axios from 'axios'
import * as qs from 'qs'
import elasticUrl from './elasticUrl'
import { log } from '../../shared'

const ElasticClient = {
  request: (requestPath = '', data = {}, method = 'GET') => {
    let payload = {}

    log(`[Elastic] ${method}  ${requestPath}`)

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
