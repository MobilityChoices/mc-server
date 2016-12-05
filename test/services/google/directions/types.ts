import { assert } from 'chai'
import { travelModes } from '../../../../src/services/google/directions/types'

describe('travelModes', () => {
  it('is an array', () => {
    assert.isArray(travelModes)
  })

  it('contains "driving"', () => {
    assert.isTrue(travelModes.indexOf('driving') >= 0)
  })

  it('contains "walking"', () => {
    assert.isTrue(travelModes.indexOf('walking') >= 0)
  })

  it('contains "bicycling"', () => {
    assert.isTrue(travelModes.indexOf('bicycling') >= 0)
  })

  it('contains "transit"', () => {
    assert.isTrue(travelModes.indexOf('transit') >= 0)
  })
})
