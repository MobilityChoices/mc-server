import { Request, IReply } from 'hapi'
import { getDirections } from '../services/google/directions'
import { Route, travelModes } from '../services/google/directions/types'

async function get(request: Request, reply: IReply) {
  const { origin, destination } = request.query
  if (origin && destination) {
    const requests: Promise<Route[]>[] = []
    travelModes.forEach(travelMode => {
      requests.push(getDirections({ origin, destination, travelMode }))
    })
    const routes = await (Promise.all(requests).then(routeArrays => {
      const routes: (Route | undefined)[] = []
      routeArrays.forEach(routeArray => {
        routes.push(routeArray.length ? routeArray[0] : undefined)
      })
      return routes
    }))
    reply({ routes }).code(200)
  } else {
    reply({ error: {} }).code(400)
  }
}

export default {
  get,
}
