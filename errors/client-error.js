class ClientError extends Error {

  constructor(message, meta = {}) {
    super(message);
    Object.keys(meta).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        value: meta[key]
      });
    });
  }

}

module.exports = ClientError;
