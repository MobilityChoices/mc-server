import * as Joi from 'joi'

const coordinate = Joi.number()
const email = Joi.string().email()
const password = Joi.string()

export const auth = Joi.object().keys({
  email: email.required(),
  password: password.required(),
})

export const location = Joi.object().keys({
  latitude: coordinate.required(),
  longitude: coordinate.required(),
  time: Joi.string().isoDate().required(),
})

export const track = Joi.object().keys({
  locations: Joi.array().items(location).required(),
})

export const user = Joi.object().keys({
  email: email.required(),
  password: password.optional(),
})
