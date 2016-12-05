import { assert } from 'chai'
import * as axios from 'axios'
import * as sinon from 'sinon'
import googleGeocode from '../../../fixtures/googleGeocode'
import { getAddress } from '../../../../src/services/google/geocode'

describe('Google Geocode Service', () => {
  let axiosGet: sinon.SinonStub

  beforeEach(() => {
    sinon.stub(axios, 'get')
    axiosGet = axios.get as sinon.SinonStub
    axiosGet.resolves({ data: googleGeocode })
  })

  afterEach(() => {
    axiosGet.restore()
  })

  const requestConfig = {
    lat: 47.4124,
    lng: 9.7438,
  }

  it('returns a promise', () => {
    assert.instanceOf(getAddress(requestConfig), Promise)
  })

  it('resolves to an array', (done) => {
    getAddress(requestConfig).then((addresses) => {
      assert.isArray(addresses)
      done()
    })
  })

  it('... of address objects', (done) => {
    getAddress(requestConfig).then((addresses) => {
      addresses.forEach((address) => {
        assert.isString(address.formatted_address)
      })
      done()
    })
  })
})
