import { QuidParams, useQuidRequests } from "../src/main";
import { conf } from "./server/src/conf";
import { start, stop } from "./server/src/index"


beforeEach(() => {
  start();
});

afterEach(() => {
  stop();
});

const quid = useQuidRequests({
  namespace: "testns", // the namespace to use
  quidUri: "http://localhost:8090", // quid server url
  serverUri: "http://localhost:5714", // url of your backend
  verbose: true,
} as QuidParams);


describe('login and request', () => {
  it('200', async () => {
    await quid.login(conf.userName, conf.userPwd);
    const res = await quid.get<Record<string, any>>("/");
    console.log("RES", res)
    //expect(res.data).toEqual({ response: "ok" })
  });
});