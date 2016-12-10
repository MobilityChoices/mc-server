import * as axios from 'axios'
import * as qs from 'qs'
import env from '../../../env'
import { RequestConfig, Address, ApiResponse } from './types'
import { log } from '../../../shared'

const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'

export async function getAddress(config: RequestConfig) {
  return new Promise<Address[]>((resolve, reject) => {
    const params = {
      latlng: `${config.lat},${config.lng}`,
      key: env.GOOGLE_API_KEY,
    }
    const url = `${BASE_URL}?${qs.stringify(params)}`
    log(`Google Geocode API: ${url}`)
    axios.get<ApiResponse>(url).then((response) => {
      resolve(response.data.results)
    }).catch((err) => {
      reject(err)
    })
  })
}
