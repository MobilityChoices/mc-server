const isTestEnvironment = process.env['NODE_ENV'] === 'test'

export function log(message: string) {
  if (!isTestEnvironment) {
    // tslint:disable-next-line no-console
    console.log(message)
  }
}
