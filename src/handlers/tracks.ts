import { Request, IReply } from 'hapi'

async function create(request: Request, reply: IReply) {
  reply('')
}

export default {
  create,
}
