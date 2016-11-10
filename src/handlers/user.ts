import { Request, IReply } from 'hapi'
import userRepository from '../services/storage/repositories/user'
import { verifyToken } from '../helpers/auth'
import { sanitizeUser } from '../helpers/types'

async function me(request: Request, reply: IReply) {
  const token = verifyToken(request.headers['authorization'])
  if (!token) {
    return reply({}).code(400)
  }
  userRepository.find(token.userId)
    .then(user => reply(sanitizeUser(user._source)))
    .catch(err => reply(err).code(400))
}

export default {
  me,
}
