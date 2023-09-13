interface QuidParams {
  quidUri: string;
  serverUri: string;
  namespace: string;
  credentials?: string | null;
  verbose: boolean;
}

interface QuidLoginParams {
  username: string;
  password: string;
}

export { QuidParams, QuidLoginParams };