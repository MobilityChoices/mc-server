import * as moment from 'moment'
import repository from '../repository'

type SearchConfig = {
  from: number,
  size: number,
}

type Track = {
  created: string,
  owner: string,
  locations: { location: { lat: number, lon: number }, time: string }[],
}

const trackRepository = {
  all: (searchConfig: SearchConfig) => {
    return repository.query<Track>('tracks', 'default', searchConfig)
  },

  get: (id: string) => {
    return repository.find<Track>('tracks', 'default', id)
  },

  create: (track: any) => {
    return repository.create('tracks', 'default', {
      ...track,
      created: moment().toISOString(),
    })
  },

  query: (query: Object) => {
    return repository.query<Track>('tracks', 'default', query)
  }
}

export default trackRepository
