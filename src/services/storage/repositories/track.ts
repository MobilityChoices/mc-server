import repository from '../repository'

type SearchConfig = {
  from: number,
  size: number,
}

type Track = {
  owner: string,
  locations: { location: { lat: number, lon: number }, time: string }[],
}

const trackRepository = {
  all: (searchConfig: SearchConfig) => {
    return repository.query<Track>('tracks', 'default', searchConfig)
  },

  create: (track: any) => {
    return repository.create('tracks', 'default', track)
  },
}

export default trackRepository
