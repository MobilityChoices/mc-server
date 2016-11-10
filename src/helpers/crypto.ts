import { createHmac, randomBytes } from 'crypto'

const SALT_LENGTH = 16

const generateRandomSalt = (length: number) => {
    return randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length)
}

export const hash = (data: string, salt: string) => {
    const value = createHmac('sha512', salt).update(data).digest('hex')
    return `${salt}.${value}`
}

export const encrypt = (data: string) => {
  return hash(data, generateRandomSalt(SALT_LENGTH))
}

export const compare = (data: string, encryptedData: string) => {
    const [salt] = encryptedData.split('.')
    return hash(data, salt) === encryptedData
}
