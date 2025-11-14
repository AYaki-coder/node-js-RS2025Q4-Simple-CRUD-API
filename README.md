# node-js-RS2025Q4-Simple-CRUD-API

## Description

This project implements a CRUD API using in-memory database underneath.

### API Endpoints

#### Users

- `GET /api/users` - Get all users
- `GET /api/users/{userId}` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/{userId}` - Update an existing user
- `DELETE /api/users/{userId}` - Delete a user

#### Request/Response Format

##### User Object

```json
{
  "id": "uuid",
  "username": "string",
  "age": number,
  "hobbies": ["string"]
}
```

##### Create/Update User Request

```json
{
  "username": "string",
  "age": number,
  "hobbies": ["string"]
}
```

### Status Codes

- **GET** `api/users` is used to get all persons - Server should answer with `status code` **200** and all users records
- **GET** `api/users/{userId}`
  - Server should answer with `status code` **200** and record with `id === userId` if it exists
  - Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
  - Server should answer with `status code` **404** and corresponding message if record with `id === userId`
    doesn't exist
- **POST** `api/users` is used to create record about new user and store it in database
  - Server should answer with `status code` **201** and newly created record
  - Server should answer with `status code` **400** and corresponding message if request `body` does not contain \*
    \*required\*\* fields
- **PUT** `api/users/{userId}` is used to update existing user
  - Server should answer with `status code` **200** and updated record
  - Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
  - Server should answer with `status code` **404** and corresponding message if record with `id === userId`
    doesn't exist
- **DELETE** `api/users/{userId}` is used to delete existing user from database
  - Server should answer with `status code` **204** if the record is found and deleted
  - Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
  - Server should answer with `status code` **404** and corresponding message if record with `id === userId`
    doesn't exist

- Requests to non-existing endpoints (e.g. `some-non/existing/resource`) handled (server should answer with
  `status code` **404** and corresponding human-friendly message)
- Errors on the server side that occur during the processing of a request should be handled and processed correctly (server should answer with `status code` **500** and corresponding human-friendly message)

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/)

## How to start

### 1. Clone repository

```bash
git clone https://github.com/AYaki-coder/node-js-RS2025Q4-Simple-CRUD-API.git
```

### 2. Go to folder code

```bash
 cd node-js-RS2025Q4-Simple-CRUD-API
```

### 3. Checkout to the `develop` branch

```bash
git checkout develop
```

### 4. Install dependencies

```bash
npm install
```

### 5. Create `.env` file

```bash
cp .env.example .env

```

### 6. Run the app

in development mode

```bash
npm run start:dev
```

in production mode

```bash
npm run start:prod
```

multiple instances using Node.js Cluster API

in development mode

```bash
npm npm run start:dev:multi
```

in production mode

```bash
npm npm run start:prod:multi
```

## How to test

Folder tests contains e2e tests.

### 1. Start the API

Run the app in development mode

```bash
npm run start:dev
```

Or run the app in production mode

```bash
npm run start:prod
```

To start multiple instances using Node.js Cluster API

in development mode

```bash
npm npm run start:dev:multi
```

in production mode

```bash
npm npm run start:prod:multi
```

### 2. Run tests in a new terminal

```bash
npm npm run test
```
