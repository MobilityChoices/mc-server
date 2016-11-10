export interface Error {
  code: 'BadArgument' | 'ServerError'
  message?: string
  target?: string
  details?: Error[]
}

export const serverError = () => ({
  error: {
    code: 'ServerError',
    message: 'an unexpected server error occurred.',
    target: ''
  }
})
