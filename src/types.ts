import * as Joi from 'joi'

export type Maybe<T> = T | undefined

export interface MCError {
  code: 'BadArgument' | 'ServerError'
  message?: string
  target?: string
  details?: MCError[]
}

export const isString = (v: any): v is string => {
  const result = Joi.validate(v, Joi.string().required())
  return result.error === null
}

export const isEmail = (v: string): boolean => {
  const result = Joi.validate(v, Joi.string().email().required())
  return result.error === null
}

export const isArray = <T>(v: T[]): v is Array<T> => {
  return Array.isArray(v)
}

export const isNumber = (v: any): v is number => {
  return typeof v === 'number'
}

export const isDate = (v: any): v is Date => {
  return v instanceof Date
}

export interface UserInfo {
  email: string
  password: string
}

export interface User {
  email: string
  password: string
}

export const isUser = (maybeUser: any): maybeUser is User => {
  const user = (maybeUser || {}) as User
  return isString(user.email) && isString(user.password)
}

export interface Location {
  latitude: number
  longitude: number
  time: Date
}

export const isLocation = (maybeLocation: any): maybeLocation is Location => {
  const location = (maybeLocation || {}) as Location
  return (
    isNumber(location.latitude) &&
    isNumber(location.longitude) &&
    isDate(location.time)
  )
}

export interface Track {
  locations: Location[]
}

export const isTrack = (maybeTrack: any): maybeTrack is Track => {
  const track = (maybeTrack || {}) as Track
  return isArray(track.locations)
}
