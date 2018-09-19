const { UPDATE_TEXT_FIELD } = require('../constants');
import assert from 'bsert';

const updateTextField = (field, value, valid) => {
  return {
    type: UPDATE_TEXT_FIELD,
    payload: { field, value, valid },
  };
};

/*
 * see: https://bpanel.org/docs/api-reducers.html#navstore
 *
 */

function addSideNav(metadata) {
  assert(metadata.name);
  assert(metadata.pathName);
  assert(metadata.displayName);

  // TODO: turn type into constant
  return {
    type: 'ADD_SIDE_NAV',
    payload: metadata,
  }
}

module.exports = {
  updateTextField,
  addSideNav,
};
