class BadRequestError extends Error {

  constructor(message = 'Bad request') {
    super(message);
  }

  get status() {
    return 400;
  }

}

module.exports = BadRequestError;
