const Joi = require('joi')

const locationSchema = Joi.object().keys({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  time: Joi.string().isoDate().required(),
})

const trackSchema = Joi.object().keys({
  locations: Joi.array().items(locationSchema).required(),
  owner: Joi.string().required(),
})

const options = {
    allowUnknown: true,
    stripUnknown: true,
}

const validateTrack = (track) => new Promise((resolve, reject) => {
  Joi.validate(track, trackSchema, options, (err, validatedTrack) => {
    if (err) {
      return reject(err)
    }
    return resolve(validatedTrack)
  })
})

module.exports = validateTrack
