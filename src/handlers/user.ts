import { Request, IReply } from 'hapi'
import userRepository from '../services/storage/repositories/user'
import { verifyToken } from '../helpers/auth'
import { sanitizeUser } from '../helpers/types'
import { serverError, authenticationError } from '../helpers/errors'

async function me(request: Request, reply: IReply) {
  const token = verifyToken(request.headers['authorization'])
  if (!token) {
    return reply({ error: authenticationError() }).code(401)
  }
  try {
    const user = await userRepository.find(token.userId)
    if (!user) {
      // FATAL: this means there‘s a valid token, but no corresponding user
      return reply({ error: {} }).code(400)
    }
    return reply(sanitizeUser(user._source)).code(200)
  } catch (e) {
    return reply({ error: serverError() }).code(500)
  }
}

export default {
  me,
}
