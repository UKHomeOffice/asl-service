const { router } = require('../../ui');
const assert = require('assert');

describe('ui', () => {

  it('can initialise without error', () => {
    assert.doesNotThrow(() => router({}));
  });

});
