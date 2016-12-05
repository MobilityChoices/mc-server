import { Request, IReply } from 'hapi'
import { getDirections } from '../services/google/directions'
import { Route, travelModes } from '../services/google/directions/types'
import * as RouteHelpers from '../helpers/route-helpers'

async function get(request: Request, reply: IReply) {
  const { origin, destination } = request.query
  try {
    if (origin && destination) {
      const requests = travelModes.map(travelMode => (
        getDirections({ origin, destination, travelMode })
      ))
      const routes = await (Promise.all(requests).then(routeArrays => {
        const routes: (Route | undefined)[] = []
        routeArrays.forEach(routeArray => {
          routes.push(routeArray.length ? routeArray[0] : undefined)
        })
        return routes.map(RouteHelpers.googleToGeneric).filter(r => !!r)
      }))
      reply({ routes }).code(200)
    } else {
      reply({ error: {} }).code(400)
    }
  } catch (exception) {
    reply({ error: {} }).code(500)
  }
}

export default {
  get,
}
