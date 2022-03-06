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
import { QuidRequests } from "quidjs";

const requests = new QuidRequests({
  namespace: "my_namespace",
  timeouts: {
    accessToken: "5m",
    refreshToken: "24h"
  },
  quidUri: conf.quidUrl,
  serverUri: "https://localhost:8000",
  verbose: true,
});

async function get(uri: string): Record<string, any> {
  let data = await requests.get<Record<string,any>>(uri);
  return data
}

async function post(uri: string, payload: Record<string, any>): Record<string, any> {
  let data = await requests.post<Record<string,any>>(uri, payload);
  return data
}
```


