import { User } from "@snowind/state";
import { QuidParams, useQuidRequests } from "../../../src/main";

const user = new User();
const quid = useQuidRequests({
  namespace: "testns", // the namespace to use
  quidUri: "http://localhost:8090", // quid server url
  serverUri: "http://localhost:5714", // url of your backend
  verbose: true,
} as QuidParams);

export { user, quid }