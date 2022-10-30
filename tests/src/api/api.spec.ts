import { expect, test } from '@playwright/test';
import { testNs, testUser, quidServerUrl } from "../../conf";
import { useQuidRequests } from "../../../src/main";

const quid = useQuidRequests({
  namespace: testNs,
  timeouts: {
    accessToken: "20m",
    refreshToken: "24h"
  },
  quidUri: "http://localhost:8090", // quid server url
  serverUri: "http://localhost:5714", // url of your backend
  verbose: true,
});

test('api', async ({ page, request }) => {
  // request without token
  const issues = await request.get('http://localhost:5714')
  expect(issues.status()).toEqual(401)
  // grab a refresh token
  await quid.login(testUser.name, testUser.pwd);
  // request
  const resp = await quid.get('/')
  console.log("RESP", resp)
  /*const resp = await request.post(quidServerUrl + `/token/refresh/24h`, {
    data: {
      namespace: testNs,
      username: testUser.name,
      password: testUser.pwd,
    }
  });
  const rt = await resp.json()
  console.log("Refresh token", rt);*/
  // grab an access token
  await page.pause();
});