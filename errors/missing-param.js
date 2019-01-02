class MissingParamError extends Error {

  constructor(param) {
    super(`Parameter '${param}' is required`);
  }

  get status() {
    return 400;
  }

}

module.exports = MissingParamError;
