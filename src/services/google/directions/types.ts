export type TravelMode = 'driving' | 'walking' | 'bicycling' | 'transit'
export type Location = string

export interface RequestConfig {
  travelMode: TravelMode
  origin: Location
  destination: Location
}

export interface Step {
  distance: {},
  duration: {},
  end_location: { lat: number, lng: number },
  start_location: { lat: number, lng: number },
  travel_mode: string
}

export interface Leg {
  distance: {},
  duration: {},
  end_address: string,
  end_location: { lat: number, lng: number },
  start_address: string,
  start_location: { lat: number, lng: number },
  steps: Step[]
}

export interface Route {
  bounds: {},
  legs: Leg[]
}

export interface ApiResponse {
  routes: Route[]
}
