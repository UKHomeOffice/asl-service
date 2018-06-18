const UI = require('../../ui');

describe('ui', () => {

  test('can initialise without error', () => {
    expect(() => UI({})).not.toThrow();
  });

});
