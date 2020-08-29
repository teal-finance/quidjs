# Quidjs

A requests library for the [Quid](https://github.com/synw/quid) json web tokens server

This library transparently manage the requests to api servers. If a server returns a 401 Unauthorized response
when an access token is expired the client library will request a new access token from a Quid server, using a refresh
token, and will retry the request with the new access token

## Usage

```javascript
var requests = new QuidRequests({
  namespace: "my_namespace",
  timeouts: {
    accessToken: "5m",
    refreshToken: "24h"
  },
  axiosConfig: {
    baseURL: "https://myquideserver.com",
    timeout: 5000
  },
})

async function get(uri) {
    try {
      let response = await requests.get(uri);
      return { response: response, error: null }
    } catch (e) {
      if (e.hasToLogin) {
        // the user has no refresh token: a login is required
      }
      return { response: null, error: e }
    }
  }
```


