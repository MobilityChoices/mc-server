import { User } from '../../../helpers/types'
import repository, { Document } from '../repository'

const userRepository = {
  create: (user: any) => {
    return repository.create('users', 'default', user)
  },

  find: (id: string) => {
    return repository.find<User>('users', 'default', id)
  },

  findByEmail: (email: string) => {
    const query = { query: { term: { email: email } } }
    return new Promise<Document<User>>((resolve, reject) => {
      repository.query<User>('users', 'default', query).then(response => {
        if (response.hits.hits.length > 0) {
          resolve(response.hits.hits[0])
        } else {
          resolve(undefined)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },

  update: (id: string, user: Partial<User>) => {
    return new Promise<any>((resolve, reject) => {
      repository.update<User>('users', 'default', id, user).then(response => {
        resolve(response)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default userRepository
