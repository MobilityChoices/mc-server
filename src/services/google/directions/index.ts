import * as axios from 'axios'
import * as qs from 'qs'
import { RequestConfig, ApiResponse, Route } from './types'
import env from '../../../env'

const BASE_URL = 'https://maps.googleapis.com/maps/api/directions/json'

export async function getDirections(config: RequestConfig) {
  return new Promise<Route[]>((resolve, reject) => {
    const params = {
      mode: config.travelMode,
      origin: config.origin,
      destination: config.destination,
      key: env.GOOGLE_API_KEY,
    }
    const url = `${BASE_URL}?${qs.stringify(params)}`
    console.log(`Google Directions API: ${url}`)
    axios.get<ApiResponse>(url).then((response) => {
      resolve(response.data.routes)
    }).catch((err) => {
      reject(err)
    })
  })
}
