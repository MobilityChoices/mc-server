import { Request, IReply } from 'hapi'
import { getAuthenticatedUser } from '../helpers/auth'
import { sanitizeUser } from '../helpers/types'
import { serverError, authenticationError } from '../helpers/errors'
import UserRepository from '../services/storage/repositories/user'

async function me(request: Request, reply: IReply) {
  try {
    const user = await getAuthenticatedUser(request.headers['authorization'])
    if (user) {
      return reply(sanitizeUser(user._source)).code(200)
    } else {
      return reply({ error: authenticationError() }).code(401)
    }
  } catch (e) {
    return reply({ error: serverError() }).code(500)
  }
}

async function updateProfile(request: Request, reply: IReply) {
  try {
    const user = await getAuthenticatedUser(request.headers['authorization'])
    if (user) {
      const partialUser = (request.payload || {}) as Partial<typeof user._source>
      if (!user._source.isAdmin) {
        partialUser.isAdmin = false
      }
      await UserRepository.update(user._id, partialUser)
      return reply({ status: 'ok' }).code(200)
    } else {
      return reply({ error: authenticationError() }).code(401)
    }
  } catch (e) {
    return reply({ error: serverError() }).code(500)
  }
}

export default {
  me,
  updateProfile,
}
