import { Request, IReply } from 'hapi'
import {
  Error,
  authenticationError,
  malformedValueError,
  serverError
} from '../helpers/errors'
import { isTrack, Track, Location } from '../helpers/types'
import trackRepository from '../services/storage/repositories/track'
import { getAuthenticatedUser } from '../helpers/auth'
import * as moment from 'moment'

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


function getTimeDiff(start?: Location, end?: Location): number {
  if (start && end) {
    const startMoment = moment(start.time)
    const endMoment = moment(end.time)
    if (startMoment.isValid() && endMoment.isValid()) {
      return endMoment.diff(startMoment, 'seconds')
    }
  }
  return -1
}

async function all(request: Request, reply: IReply) {
  try {
    const user = await getAuthenticatedUser(request.headers['authorization'])
    if (!user) {
      return reply({ error: authenticationError() }).code(401)
    }
    const tracks = await getAllTracks(0, 20, user._id)
    const minimalTracks = tracks.hits.hits.map((track) => {
      const source = track._source
      const created = source.created || undefined
      const locations = source.locations || []
      const start = locations.length && locations[0] || undefined
      const end = locations.length && locations[locations.length - 1] || undefined
      const duration = getTimeDiff(start, end)
      return { id: track._id, created, start, end, duration }
    })
    reply({ data: minimalTracks }).code(200)
  } catch (e) {
    reply({ error: serverError() }).code(500)
  }
}

async function get(request: Request, reply: IReply) {
  try {
    const user = await getAuthenticatedUser(request.headers['authorization'])
    if (!user) {
      return reply({ error: authenticationError() }).code(401)
    }
    const track = await trackRepository.get(request.params['id'])
    if (!track) {
      return reply({ error: {} }).code(404)
    }
    if (track._source.owner !== user._id) {
      return reply({ error: authenticationError() }).code(401)
    }
    reply(track._source).code(200)
  } catch (e) {
    reply({ error: serverError() }).code(500)
  }
}

async function adminAll(request: Request, reply: IReply) {
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
    const tracks = await getAllTracks(from, size, '*')
    reply(tracks.hits).code(200)
  } catch (e) {
    reply({ error: serverError() }).code(500)
  }
}

export default {
  create,
  get,
  all,
  admin: {
    all: adminAll,
  }
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

function getAllTracks(skip: number, top: number, owner = '*') {
  const query = {
    from: skip,
    size: top,
    sort: { 'created': { 'order': 'desc' } },
    query: owner !== '*' ? { term: { owner } } : undefined,
  }
  return trackRepository.query(query)
}
