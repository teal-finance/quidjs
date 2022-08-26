# Quidjs

[![pub package](https://img.shields.io/npm/v/quidjs)](https://www.npmjs.com/package/quidjs)

A requests library for the [Quid](https://github.com/synw/quid) json web tokens server

This library transparently manage the requests to api servers. If a server returns a 401 Unauthorized response
when an access token is expired the client library will request a new access token from a Quid server, using a refresh
token, and will retry the request with the new access token

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
  timeouts: {
    accessToken: "5m",
    refreshToken: "24h"
  },
  quidUri: "https://localhost:8082", // quid server url
  serverUri: "https://localhost:8000", // url of your backend
  verbose: true,
});

async function get(uri: string): Promise<Record<string, any>> {
  let data = await quid.get<Record<string,any>>(uri);
  return data
}

async function post(uri: string, payload: Record<string, any>): Promise<Record<string, any>> {
  let data = await quid.post<Record<string,any>>(uri, payload);
  return data
}

// login the user
await quid.login("user", "pwd");
const response = await quid.get<Record<string,any>>("/api");
console.log("Backend response:", response)
```

## Examples

- [Script src](examples/umd)
- [Script module](examples/esm)


