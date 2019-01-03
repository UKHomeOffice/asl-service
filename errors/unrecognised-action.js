class UnrecognisedActionError extends Error {

  constructor() {
    super('Unrecognised action');
  }

  get status() {
    return 400;
  }

}

module.exports = UnrecognisedActionError;
