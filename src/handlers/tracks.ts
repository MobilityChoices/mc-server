import { Request, IReply } from 'hapi'
import { verifyToken } from '../helpers/auth'
import { authenticationError } from '../helpers/errors'

async function create(request: Request, reply: IReply) {
  const token = verifyToken(request.headers['authorization'])
  if (!token) {
    return reply({ error: authenticationError() }).code(401)
  }
  reply('').code(201)
}

export default {
  create,
}
