const { assert } = require('chai');

const { TEXT_STORE_KEY } = require('../lib/constants');

const { reduceInterface } = require('../lib/reducers');
const { updateTextField } = require('../lib/actions');

describe('interface reducer', () => {
  it('should update properly', () => {
    const field = 'foo';
    const value = 'bar';
    const valid = true;
    const action = updateTextField(field, value, valid);

    const newState = reduceInterface(undefined, action);

    const expected = {
      [TEXT_STORE_KEY]: { [field]: { value, valid } },
    };

    assert.deepEqual(newState, expected);
  });
});
