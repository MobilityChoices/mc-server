const Joi = require('joi')

const coordinate = Joi.number()
const email = Joi.string().email()
const id = Joi.string()
const password = Joi.string()

const auth = Joi.object().keys({
  email: email.required(),
  password: password.required(),
})

const location = Joi.object().keys({
  latitude: coordinate.required(),
  longitude: coordinate.required(),
  time: Joi.string().isoDate().required(),
})

const track = Joi.object().keys({
  locations: Joi.array().items(location).required(),
  owner: id.required(),
})

const user = Joi.object().keys({
  email: email.required(),
  password: password.optional(),
})

module.exports = {
  auth,
  location,
  track,
  user,
}
