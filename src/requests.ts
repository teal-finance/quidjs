import { QuidError, QuidRequestError } from "./errors";
import { QuidLoginParams, QuidParams } from "./interfaces";

const useQuidRequests = (
  { quidUri, serverUri, namespace, timeouts = {
    accessToken: "20m",
    refreshToken: "24h"
  },
    credentials = "include",
    verbose = false,
    accessTokenUri = null }: QuidParams) => {
  let refreshToken: string | null = null;
  let accessToken: string | null = null;
  let headers: HeadersInit;

  const get = async function <T = Record<string, any>>(url: string): Promise<T> {
    return await _request<T>(url, "get");
  }

  const post = async function <T = Record<string, any>>(url: string, payload: Record<string, any> | Array<any>): Promise<T> {
    return await _request<T>(url, "post", payload);
  }

  const login = async function (username: string, password: string) {
    await getRefreshToken({ username: username, password: password } as QuidLoginParams);
    await _checkTokens();
  }

  const getRefreshToken = async function ({ username, password, refreshTokenTtl = "24h" }: QuidLoginParams) {
    const uri = quidUri + "/token/refresh/" + refreshTokenTtl;
    const payload = {
      namespace: namespace,
      username: username,
      password: password,
    }
    try {
      const opts: RequestInit = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      };
      const response = await fetch(uri, opts);
      //console.log("RESPONSE", response)
      if (!response.ok) {
        console.log("RESP NOT OK", response);
        throw new Error(response.statusText)
      }
      const t = await response.json();
      if (verbose) {
        console.log("Setting refresh token")
      }
      refreshToken = t.token;
    } catch (e) {
      throw new Error(`${e}`);
    }
  }

  const _checkTokens = async function (): Promise<void> {
    if (refreshToken === null) {
      if (verbose) {
        console.log("Tokens check: no refresh token")
      }
      throw new QuidError('No refresh token found', true);
    }
    if (accessToken === null) {
      if (verbose) {
        console.log("Tokens check: no access token")
      }
      const status = await _getAccessToken();
      if (status === 401) {
        if (verbose) {
          console.log("The refresh token has expired")
        }
        throw new QuidError('The refresh token has expired', true);
      }
      headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': "Bearer " + accessToken
      } as HeadersInit;
    }
  }

  const _request = async function <T>(
    url: string,
    method: string,
    payload: Record<string, any> | Array<any> | null = null,
    retry = 0
  ): Promise<T> {
    if (verbose) {
      console.log(method + " request to " + url)
    }
    await _checkTokens();
    let opts: RequestInit;
    if (method === "post") {
      opts = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      };
      if (credentials !== null) {
        opts.credentials = credentials as RequestCredentials;
      }
    } else {
      opts = {
        method: 'GET',
        headers: headers,
      };
      if (credentials !== null) {
        opts.credentials = credentials as RequestCredentials;
      }
    }
    const response = await fetch(serverUri + url, opts);
    if (!response.ok) {
      if (response.status === 401) {
        accessToken = null;
        _checkTokens();
        retry++;
        if (retry > 2) {
          throw new Error("Too many retries")
        }
        if (verbose) {
          console.log("Request retry", retry)
        }
        return _request<T>(url, method, payload, retry);
      }
      console.log("RESP NOT OK", response);
      const err = new QuidRequestError(`Request ${method} to ${url} failed`, response)
      throw err
    }
    const data = await response.json() as T;
    return data
  }

  const _getAccessToken = async function (): Promise<number> {
    const payload = {
      namespace: namespace,
      refresh_token: refreshToken,
    }
    let url = quidUri + "/token/access/" + timeouts.accessToken;
    if (accessTokenUri !== null) {
      url = accessTokenUri
    }
    if (verbose) {
      console.log("Getting an access token from", url, payload)
    }
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    const opts: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    };
    const response = await fetch(url, opts);
    if (!response.ok) {
      return response.status;
    }
    const data = await response.json();
    accessToken = data.token;
    return response.status;
  }

  return {
    get,
    post,
    login,
    getRefreshToken,
    refreshToken,
    quidUri,
    serverUri,
    namespace,
    timeouts,
  }
}

export { useQuidRequests }