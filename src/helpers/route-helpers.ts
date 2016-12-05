import { Route as GoogleRoute, TravelMode, Leg, Step } from '../services/google/directions/types'

type GenericStep = {
  distance: number,
  duration: number,
  start: {
    address: string | undefined,
    location: { lat: number, lng: number },
  },
  end: {
    address: string | undefined,
    location: { lat: number, lng: number },
  },
  steps: GenericStep[],
  travelMode: TravelMode | undefined
}

function stepMapper(step: Step | Leg): GenericStep {
  return {
    distance: step.distance.value,
    duration: step.duration.value,
    start: {
      address: (step as Leg).start_address || undefined,
      location: step.start_location,
    },
    end: {
      address: (step as Leg).end_address || undefined,
      location: step.end_location,
    },
    steps: (step.steps || []).map(stepMapper),
    travelMode: ((step as Step).travel_mode || '').toLowerCase() as TravelMode || undefined,
  }
}

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
  const legs = route.legs.map(stepMapper)
  return { legs, travelMode }
}
