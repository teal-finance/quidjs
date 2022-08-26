class QuidError extends Error {
  hasToLogin: boolean;

  constructor(message: string, _hasToLogin: boolean = false) {
    super(message);
    this.name = "QuidError";
    this.stack = (new Error() as any).stack;
    this.hasToLogin = _hasToLogin;
  }
}

class QuidRequestError extends QuidError {
  response: Response;

  constructor(message: string, response: Response, _hasToLogin: boolean = false) {
    super(message);
    this.name = "QuidError";
    this.stack = (new Error() as any).stack;
    this.hasToLogin = _hasToLogin;
    this.response = response;
  }
}

export { QuidError, QuidRequestError };