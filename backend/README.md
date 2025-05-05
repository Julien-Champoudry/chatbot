# Backend

Provide an API to query openAI.

API:
- POST `/api/chat`
  - Request:
    - body: `{ prompt: string }`
  - Response:
    - body: `{ completion: string }`

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```
## Env file
copy `.env.example` to `.env`
ask @raphael for an OPEN_AI_KEY 

## Running the app

```bash
# development (run on port 3000)
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

Nest is [MIT licensed](LICENSE).
