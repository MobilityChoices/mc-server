# Testing

- [`mocha`](https://mochajs.org/) (test runner)
- [`chai`](http://chaijs.com/) (assertion library)
- [`sinon`](http://sinonjs.org/docs/) (stubs, mocks, spies)



```javascript
describe('Profile Api', () => {
  describe('update', () => {
    context('success', () => {
      it('responds with status code 200', () => {
        // ...
        assert.equal(response.statusCode, 200)
      })
    })
  })
})
```

```javascript
const stub = sinon.stub(axios, 'request')
// ...

// do not forget to restore original method:
stub.restore()
```
