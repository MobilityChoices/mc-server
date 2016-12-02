import { Request, IReply } from 'hapi'
import { getDirections } from '../services/google/directions'

async function get(request: Request, reply: IReply) {
  const { origin, destination } = request.query
  if (origin && destination) {
    const routes = await getDirections({
      origin, destination, travelMode: 'walking'
    })
    const route = routes.length ? routes[0] : {}
    reply(route).code(200)
  } else {
    reply({ error: {} }).code(400)
  }
}

export default {
  get,
}
