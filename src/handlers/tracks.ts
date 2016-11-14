import { Request, IReply } from 'hapi'
import {
  Error,
  authenticationError,
  malformedValueError,
  serverError
} from '../helpers/errors'
import { isTrack, Track } from '../helpers/types'
import trackRepository from '../services/storage/repositories/track'
import { getAuthenticatedUser } from '../helpers/auth'

async function create(request: Request, reply: IReply) {
  try {
    const user = await getAuthenticatedUser(request.headers['authorization'])
    if (!user) {
      return reply({ error: authenticationError() }).code(401)
    }
    const result = createTrackInfo(request.payload, user._id)
    if (!result.success) {
      return reply({ error: result.error }).code(400)
    }
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

async function all(request: Request, reply: IReply) {
  try {
    const user = await getAuthenticatedUser(request.headers['authorization'])
    if (!user) {
      return reply({ error: authenticationError() }).code(401)
    }
    if (!user._source.isAdmin) {
      return reply({ error: {} }).code(403)
    }
    const from = Math.max(request.query.$skip, 0) || 0
    const size = Math.min(Math.max(0, request.query.$top), 25)
    const tracks = await trackRepository.all({ from, size })
    reply(tracks.hits).code(200)
  } catch (e) {
    reply({ error: serverError() }).code(500)
  }
}

export default {
  create,
  all,
}

type TrackInfoResult =
  { success: true, trackInfo: Track } |
  { success: false, error: Error }

export const createTrackInfo = (data: any, owner: string): TrackInfoResult => {
  if (isTrack(data)) {
    const trackInfo = {
      owner,
      locations: data.locations.map((l: any) => ({
        location: {
          lon: l.longitude,
          lat: l.latitude,
        },
        time: l.time
      }))
    }
    return { success: true, trackInfo }
  }
  const error = malformedValueError('track', 'track is not valid')
  return { success: false, error }
}
