import ElasticClient from './client'

interface ShardsInfo {
  total: number
  successful: number
  failed: number
}

interface CreateResponse {
  _index: string
  _type: string
  _id: string
  _version: number
  _shards: ShardsInfo
  created: boolean
}

export interface Document<T> {
  _index: string
  _type: string
  _id: string
  _source: T
}

interface SearchDocument<T> extends Document<T> {
  _score: number
}

interface SearchResponse<T> {
  took: number
  timed_out: boolean
  _shards: ShardsInfo,
  hits: {
    total: number
    max_score: number
    hits: SearchDocument<T>[]
  }
}

const repository = {
  create: <T>(index: string, type: string, value: T) => {
    return new Promise<string>((resolve, reject) => {
      ElasticClient.request(`/${index}/${type}/`, value, 'POST')
        .then((response: CreateResponse) => {
          if (response && response._id) {
            resolve(response._id)
          } else {
            reject({})
          }
        }).catch((err: any) => {
          reject(err)
        })
    })
  },

  find: <T>(index: string, type: string, id: string) => {
    return new Promise<Document<T>>((resolve, reject) => {
      ElasticClient.request(`/${index}/${type}/${id}`, {}, 'GET')
        .then((response: Document<T>) => {
          if (response && response._id) {
            resolve(response)
          } else {
            reject({})
          }
        }).catch((err: any) => {
          reject(err)
        })
    })
  },

  query: <T>(index: string, type: string, query: Object) => {
    return new Promise<SearchResponse<T>>((resolve, reject) => {
      ElasticClient.request(`/${index}/${type}/_search`, query, 'POST')
        .then((response: SearchResponse<T>) => {
          if (response) {
            resolve(response)
          } else {
            reject({})
          }
        }).catch((err: any) => {
          reject(err)
        })
    })
  }
}

export default repository
