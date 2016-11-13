import { Request, IReply } from 'hapi'

async function create(request: Request, reply: IReply) {
  reply('').code(201)
}

export default {
  create,
}
