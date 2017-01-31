# Elasticsearch

## Creating a Document

[→ Documentation](https://www.elastic.co/guide/en/elasticsearch/guide/current/create-doc.html)

```http
POST /<index>/<type>

<json-body>
```

## Retrieving a Document

[→ Documentation](https://www.elastic.co/guide/en/elasticsearch/guide/current/get-doc.html)

```http
GET /<index>/<type>/<id>
```

## Updating a Document

[→ Documentation](https://www.elastic.co/guide/en/elasticsearch/guide/current/update-doc.html)

```http
PUT /<index>/<type>/<id>

<json-body>
```

[Partial Updates](https://www.elastic.co/guide/en/elasticsearch/guide/current/partial-updates.html)

## Deleting a Document

[→ Documentation](https://www.elastic.co/guide/en/elasticsearch/guide/current/delete-doc.html)

```http
DELETE /<index>/<type>/<id>
```

## Search Documents

[→ Documentation](https://www.elastic.co/guide/en/elasticsearch/guide/current/search-in-depth.html)


# TypeScript

```typescript
// good old javascript 
const user = getCurrentUser(req)

interface User {
  firstName: string
  lastName: string
}

// Note: TypeScript has a structural type system instead of a nominal type system
//       I guess you've more experience with nominal type systems

// type guard
function isString(str: any): str is string {
  return typeof str === 'string'
}

// type definition
type StatusCode = 'OK' | 'Not Found' | 'Created'

let statusCode: StatusCode // <-- only valid values are OK, Not Found, Created


// async/await: allows to write linear asynchronous code 
async function foo() {
  // ...
  const a = await getA()
  // do something with a
  // ...
}
```

Type Checking Compiler Flags:
- `--strictNullChecks`
- `--noImplicitAny`
