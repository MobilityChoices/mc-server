import * as Boom from 'boom'
import * as Joi from 'joi'

const DEFAULT_OPTIONS = {
  allowUnknown: true,
  stripUnknown: true,
}

const validate = (value: Object, schema: Object, options = DEFAULT_OPTIONS) => {
  return new Promise((resolve, reject) => {
    Joi.validate(value, schema, options, (err, validatedValue) => {
      if (err) {
        return reject(Boom.badRequest('invalid entity'))
      }
      return resolve(validatedValue)
    })
  })
}

export default validate
