export const travelModes: TravelMode[] = [
  'driving',
  'walking',
  'bicycling',
  'transit',
]

export type TravelMode = 'driving' | 'walking' | 'bicycling' | 'transit'

type GeoPoint = { lat: number, lng: number }
type Distance = { text: string, value: number }
type Duration = { text: string, value: number }

export interface RequestConfig {
  travelMode: TravelMode
  origin: Location
  destination: Location
}

export interface Step {
  distance: Distance,
  duration: Duration,
  end_location: GeoPoint,
  start_location: GeoPoint,
  travel_mode: string
  steps: Step[] | undefined
}

export interface Leg {
  distance: Distance,
  duration: Duration,
  end_address: string,
  end_location: GeoPoint,
  start_address: string,
  start_location: GeoPoint,
  steps: Step[]
}

export interface Route {
  bounds: {},
  legs: Leg[]
}

export interface ApiResponse {
  routes: Route[]
}
