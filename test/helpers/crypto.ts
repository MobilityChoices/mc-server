import { assert } from 'chai'
import { encrypt, compare } from '../../src/helpers/crypto'

describe('crypto', () => {
  const data = 'my$ecretPa55w0rd'

  describe('encrypt', () => {
    it('is a function', () => {
      assert.isFunction(encrypt)
    })

    it('returns a string', () => {
      const encryptedData = encrypt(data)
      assert.isString(encryptedData)
    })

    it('returns different strings for same input', () => {
      const encryptedData = [
        encrypt(data),
        encrypt(data),
      ]
      assert.notEqual(encryptedData[0], encryptedData[1])
    })
  })

  describe('compare', () => {
    it('is a function', () => {
      assert.isFunction(compare)
    })

    it('returns true for equal data', () => {
      const encryptedData = encrypt(data)
      assert.isTrue(compare(data, encryptedData))
    })

    it('returns false for non-equal data', () => {
      const encryptedData = encrypt(data)
      assert.isFalse(compare('50meth1ngEl5e', encryptedData))
    })
  })
})
