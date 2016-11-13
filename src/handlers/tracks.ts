import { Request, IReply } from 'hapi'
import { verifyToken } from '../helpers/auth'
import {
  Error,
  authenticationError,
  malformedValueError,
  serverError
} from '../helpers/errors'
import { isTrack, Track } from '../helpers/types'
import trackRepository from '../services/storage/repositories/track'

async function create(request: Request, reply: IReply) {
  const token = verifyToken(request.headers['authorization'])
  if (!token) {
    return reply({ error: authenticationError() }).code(401)
  }
  const result = createTrackInfo(request.payload)
  if (!result.success) {
    return reply({ error: result.error }).code(400)
  }
  try {
    const trackId = await trackRepository.create(result.trackInfo)
    if (trackId) {
      reply('').code(201)
    } else {
      reply({ error: serverError() }).code(500)
    }
  } catch (e) {
    reply({ error: serverError() }).code(500)
  }
}

export default {
  create,
}

type TrackInfoResult =
  { success: true, trackInfo: Track } |
  { success: false, error: Error }

export const createTrackInfo = (data: any): TrackInfoResult => {
  if (isTrack(data)) {
    const trackInfo = {
      locations: data.locations.map((l: any) => ({
        longitude: l.longitude,
        latitude: l.latitude,
        time: l.time
      }))
    }
    return { success: true, trackInfo }
  }
  const error = malformedValueError('track', 'track is not valid')
  return { success: false, error }
}
