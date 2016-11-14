export default {
  'took': 2,
  'timed_out': false,
  '_shards': {
    'total': 5,
    'successful': 5,
    'failed': 0
  },
  'hits': {
    'total': 3,
    'max_score': 1,
    'hits': [
      {
        '_index': 'tracks',
        '_type': 'default',
        '_id': 'AVhh6ODcLlQ86s1r6RBp',
        '_score': 1,
        '_source': {
          'locations': [
            {
              'location': {
                'lon': 23.555,
                'lat': 47.11
              },
              'time': '2016-11-14T09:04:53Z'
            },
            {
              'location': {
                'lon': 23.78,
                'lat': 66.4
              },
              'time': '2016-11-14T09:04:43Z'
            }
          ]
        }
      },
      {
        '_index': 'tracks',
        '_type': 'default',
        '_id': 'AVhh9n4GLlQ86s1r6RBr',
        '_score': 1,
        '_source': {
          'locations': [
            {
              'location': {
                'lon': 23.555,
                'lat': 47.11
              },
              'time': '2016-11-14T09:04:53Z'
            },
            {
              'location': {
                'lon': 23.78,
                'lat': 66.4
              },
              'time': '2016-11-14T09:04:43Z'
            }
          ]
        }
      },
      {
        '_index': 'tracks',
        '_type': 'default',
        '_id': 'AVhh-ONkLlQ86s1r6RBs',
        '_score': 1,
        '_source': {
          'owner': 'AVhh4Vl9LlQ86s1r6RBj',
          'locations': [
            {
              'location': {
                'lon': 23.555,
                'lat': 47.11
              },
              'time': '2016-11-14T09:04:53Z'
            },
            {
              'location': {
                'lon': 23.78,
                'lat': 66.4
              },
              'time': '2016-11-14T09:04:43Z'
            }
          ]
        }
      }
    ]
  }
}
