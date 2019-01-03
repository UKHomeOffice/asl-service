class RateLimitedError extends Error {

  constructor() {
    super('Rate limit exceeded');
  }

  get status() {
    return 429;
  }

}

module.exports = RateLimitedError;
