import axios from 'axios';
import quidException from "./exceptions";

export default class QuidRequests {
  refreshToken = null;
  #accessToken = null;

  constructor({ quidUri, namespace, axiosConfig, timeouts = {
    accessToken: "20m",
    refreshToken: "24h"
  },
    accessTokenUri = null,
    verbose = false }) {
    if (typeof quidUri !== 'string') {
      throw quidException({ error: 'Parameter quidUri has to be set' });
    }
    if (typeof namespace !== 'string') {
      throw quidException({ error: 'Parameter namespace has to be set' });
    }
    if (typeof axiosConfig !== 'object') {
      throw quidException({ error: 'Parameter axiosConfig has to be set' });
    }
    this.quidUri = quidUri;
    this.namespace = namespace;
    this.axiosConfig = axiosConfig;
    this.axios = axios.create(this.axiosConfig);
    this.axiosQuid = axios.create(
      {
        baseURL: quidUri,
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    this.timeouts = timeouts;
    this.verbose = verbose;
    this.accessTokenUri = accessTokenUri;
  }

  async get(uri) {
    return await this._requestWithRetry(uri, "get");
  }

  async post(uri, payload) {
    return await this._requestWithRetry(uri, "post", payload);
  }

  async getRefreshToken({ namespace, username, password, refreshTokenTtl = "24h" }) {
    let uri = "/token/refresh/" + refreshTokenTtl;
    let payload = {
      namespace: namespace,
      username: username,
      password: password,
    }
    try {
      let response = await this.axiosQuid.post(uri, payload);
      this.refreshToken = response.data.token;
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          throw quidException({ error: null, unauthorized: true });
        }
      }
      throw quidException({ error: e });
    }
  }

  async _requestWithRetry(uri, method, payload, retry = 0) {
    if (this.verbose) {
      console.log(method + " request to " + uri)
    }
    await this.checkTokens();
    try {
      if (method === "get") {
        //console.log("GET", this.#accessToken, uri);
        return await this.axios.get(uri);
      } else {
        //console.log("POST REQ", uri, payload)
        return await axios.post(uri, payload);
      }
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          if (this.verbose) {
            console.log("Access token has expired")
          }
          this.#accessToken = null;
          await this.checkTokens();
          if (retry > 2) {
            throw quidException({ error: "too many retries" });
          }
          retry++
          if (this.verbose) {
            console.log("Retrying", method, "request to", uri, ", retry", retry)
          }
          return await this._requestWithRetry(uri, method, payload, retry)
        } else {
          throw quidException({ error: e });
        }
      } else {
        throw quidException({ error: e });
      }
    }
  }

  async checkTokens() {
    if (this.refreshToken === null) {
      if (this.verbose) {
        console.log("Tokens check: no refresh token")
      }
      throw quidException({ error: 'No refresh token found', hasToLogin: true });
    }
    if (this.#accessToken === null) {
      if (this.verbose) {
        console.log("Tokens check: no access token")
      }
      let { token, error, statusCode } = await this._getAccessToken();
      if (error !== null) {
        if (statusCode === 401) {
          if (this.verbose) {
            console.log("The refresh token has expired")
          }
          throw quidException({ error: 'The refresh token has expired', hasToLogin: true });
        } else {
          throw quidException({ error: error });
        }
      }
      this.#accessToken = token;
      this.axiosConfig.headers.Authorization = "Bearer " + this.#accessToken
      this.axios = axios.create(this.axiosConfig);
    }
  }

  async _getAccessToken() {
    try {
      let payload = {
        namespace: this.namespace,
        refresh_token: this.refreshToken,
      }
      let url = "/token/access/" + this.timeouts.accessToken
      if (this.accessTokenUri !== null) {
        url = this.accessTokenUri
      }
      if (this.verbose) {
        console.log("Getting an access token from", url, payload)
      }
      let response = await this.axiosQuid.post(url, payload);
      return { token: response.data.token, error: null, statusCode: response.status };
    } catch (e) {
      if (e.response !== undefined) {
        return { token: null, error: e.response.data.error, statusCode: e.response.status };
      }
      return { token: null, error: e, statusCode: null }
    }
  }
}