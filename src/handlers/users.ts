import { Request, IReply } from 'hapi'
import { getAuthenticatedUser } from '../helpers/auth'
import { sanitizeUser } from '../helpers/types'
import { serverError, authenticationError } from '../helpers/errors'

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

export default {
  me,
}
