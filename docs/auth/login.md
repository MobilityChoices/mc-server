**Login**

---

- **URL**

  `POST /auth/login`

- **Data Params**

  - `email`
  - `password`

- **Success Response**

  - Code: 200
  - Content: `{}`
  - Headers:
    - Authorization: Token

- **Error Response**

  - Code: 400
  - Content: `{ statusCode: 400, error: 'Bad Request', message: 'invalid entity' }`
