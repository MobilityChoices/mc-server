const Joi = require('joi')

const DEFAULT_OPTIONS = {
  allowUnknown: true,
  stripUnknown: true,
}

const validate = (value, schema, options = DEFAULT_OPTIONS) => new Promise((resolve, reject) => {
  Joi.validate(value, schema, options, (err, validatedValue) => {
    if (err) {
      return reject(err)
    }
    return resolve(validatedValue)
  })
})

module.exports = validate
