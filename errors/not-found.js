class NotFoundError extends Error {

  constructor() {
    super('Not found');
  }

  get status() {
    return 404;
  }

}

module.exports = NotFoundError;
