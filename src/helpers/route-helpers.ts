import { Route as GoogleRoute, TravelMode } from '../services/google/directions/types'

export function googleToGeneric(route: GoogleRoute | undefined) {
  if (!route) {
    return undefined
  }
  let travelMode: TravelMode[] = []
  let currentTravelMode: TravelMode | undefined = undefined
  route.legs.forEach(leg => {
    leg.steps.forEach(step => {
      const stepTravelMode = step.travel_mode.toLowerCase() as TravelMode
      if (stepTravelMode !== currentTravelMode) {
        currentTravelMode = stepTravelMode
        travelMode.push(currentTravelMode)
      }
    })
  })
  return { ...route, travelMode }
}
