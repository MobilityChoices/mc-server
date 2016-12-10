type AddressComponent = {
  long_name: string,
  short_name: string,
  types: string[],
}

export type Address = {
  address_components: AddressComponent[],
  formatted_address: string,
  geometry: {},
  place_id: string,
  types: string[],
}

export type ApiResponse = {
  results: Address[]
}

export type RequestConfig = {
  lat: number,
  lng: number,
}
