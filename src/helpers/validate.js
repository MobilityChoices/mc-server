const Boom = require('boom')
const Joi = require('joi')

const DEFAULT_OPTIONS = {
  allowUnknown: true,
  stripUnknown: true,
}

const validate = (value, schema, options = DEFAULT_OPTIONS) => {
  return new Promise((resolve, reject) => {
    Joi.validate(value, schema, options, (err, validatedValue) => {
      if (err) {
        return reject(Boom.badRequest('invalid entity'))
      }
      return resolve(validatedValue)
    })
  })
}

module.exports = validate
