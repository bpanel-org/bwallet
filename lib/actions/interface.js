const {
  UPDATE_TEXT_FIELD,
  ADD_SIDE_NAV,
  SELECT_TAB,
  REMOVE_SIDE_NAV,
} = require('../constants');
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

  return {
    type: ADD_SIDE_NAV,
    payload: metadata,
  };
}

function removeSideNav(metadata) {
  assert(metadata.name);
  assert(metadata.pathName);
  assert(metadata.displayName);

  return {
    type: REMOVE_SIDE_NAV,
    payload: metadata,
  };
}

function selectTab(menuId, value) {
  return {
    type: SELECT_TAB,
    payload: {
      menuId,
      value,
    },
  };
}

module.exports = {
  updateTextField,
  addSideNav,
  removeSideNav,
  selectTab,
};
