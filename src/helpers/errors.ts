type ErrorCode = 'BadArgument' | 'ServerError' | 'MalformedValue' | 'Unauthenticated'

export interface Error {
  code: ErrorCode
  message?: string
  target?: string
  details?: Error[]
}

export const serverError = (): Error => ({
  code: 'ServerError',
  message: 'an unexpected server error occurred.',
  target: '',
})

export const badArgumentError = (target = '', message = '', ...details: Error[]): Error => ({
  code: 'BadArgument',
  message,
  target,
  details,
})

export const malformedValueError = (target = '', message = ''): Error => ({
  code: 'MalformedValue',
  message,
  target,
})

export const authenticationError = (): Error => ({
  code: 'Unauthenticated',
  message: 'Token is missing or invalid.',
  target: 'Authorization-Header',
})
