import env from '../../env'

const elasticUrl = (requestPath: string) => {
  const prefix = env.ELASTIC_URL

  if (!prefix) {
    throw new Error('Please define an ELASTIC_URL in env.js')
  }

  // remove trailing slash
  const sanitizedApiUrl = prefix.replace(/\/$/, '')
  // remove starting slash
  const sanitizedRequestPath = requestPath.replace(/^\//, '')

  return [sanitizedApiUrl, sanitizedRequestPath].join('/')
}

export default elasticUrl
