const { assert } = require('chai');

const { INTERFACE_NAMESPACES } = require('../lib/constants');
const { TEXT_STORE_NAMESPACE } = INTERFACE_NAMESPACES;

const { updateTextField } = require('../lib/actions');
import reduceApp from '../lib/reducers/app';

describe('interface reducer', () => {
  it('should update properly', () => {
    const field = 'foo';
    const value = 'bar';
    const valid = true;
    const action = updateTextField(field, value, valid);

    const newState = reduceInterface(undefined, action);

    const expected = {
      [TEXT_STORE_NAMESPACE]: { [field]: { value, valid } },
    };

    assert.deepEqual(newState, expected);
  });
});
