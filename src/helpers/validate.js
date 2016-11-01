const Joi = require('joi')

const DEFAULT_OPTIONS = {
  allowUnknown: true,
  stripUnknown: true,
}

class ValidationError extends Error {}

const validate = (value, schema, options = DEFAULT_OPTIONS) => {
  return new Promise((resolve, reject) => {
    Joi.validate(value, schema, options, (err, validatedValue) => {
      if (err) {
        return reject(new ValidationError(err))
      }
      return resolve(validatedValue)
    })
  })
}

validate.ValidationError = ValidationError

module.exports = validate
