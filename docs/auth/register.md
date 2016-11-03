**Register a New User**

---

- **URL**

  `POST /auth/register`

- **Data Params**

  - `email`
  - `password`

- **Success Response**

  - Code: 201
  - Content: `{}`

- **Error Response**

  - Code: 400
  - Content: `{ statusCode: 400, error: 'Bad Request', message: 'invalid entity' }`
