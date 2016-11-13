import repository from '../repository'

const trackRepository = {
  create: (track: any) => {
    return repository.create('tracks', 'default', track)
  },
}

export default trackRepository
