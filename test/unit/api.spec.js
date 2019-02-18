const Api = require('../../api');
const assert = require('assert');

describe('api', () => {

  it('can initialise without error', () => {
    assert.doesNotThrow(() => Api({}));
  });

});
