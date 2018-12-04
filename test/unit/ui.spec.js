const { router } = require('../../ui');

describe('ui', () => {

  test('can initialise without error', () => {
    expect(() => router({})).not.toThrow();
  });

});
