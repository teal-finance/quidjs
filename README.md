# QuidJS

[![pub package](https://img.shields.io/npm/v/quidjs)](https://www.npmjs.com/package/quidjs)

A requests library for the [Quid](https://github.com/teal-finance/quid) json web tokens server

This library transparently manages the JWT authentication
when accessing an API servers:
If the API server returns a *401 Unauthorized* response
when an *Access Token* is expired,
then this QuidJS client library requests a new *Access Token*
from a Quid server using a *Refresh Token*,
and sends again the failed request with the new *Access Token*.

## Add QuidJS as a dependency

```bash
yarn add quidjs
# or
npm install quidjs
```

## Usage

```typescript
import { useQuidRequests } from "quidjs";

const quid = useQuidRequests({
  namespace: "my_namespace",
  quidUri: "https://localhost:8082",   // URL of your Quid server
  serverUri: "https://localhost:8000", // URL of your API backend
  verbose: true,
});

// login the user
await quid.login("user", "pwd");

// use the quid instance to request your API backend
// GET request
const response: Record<string,any> = await quid.get<Record<string,any>>("/api/get");
console.log("Backend GET response:", response)
// POST request
const payload = {"foo": "bar"};
const response2: Record<string,any> = await quid.post<Record<string,any>>("/api/post", payload);
console.log("Backend POST response:", response2)
```

## Examples

- [Script src](examples/umd)
- [Script module](examples/esm)

## Run the tests

Create a test namespace in a Quid instance and create a user.
Open `tests/src/conf.ts` and update the namespace key and credentials.
Then run the tests:

```
yarn test
```
