const {
  INTERFACE_NAMESPACES,
  UPDATE_TEXT_FIELD,
  SELECT_TAB,
} = require('../constants');
const { TEXT_STORE_NAMESPACE, TAB_STORE_NAMESPACE } = INTERFACE_NAMESPACES;

const initialState = {
  [TEXT_STORE_NAMESPACE]: {},
  [TAB_STORE_NAMESPACE]: {},
};

function reduceInterface(state = initialState, action) {
  let newState = { ...state };
  const { type, payload = {} } = action;

  const { field, value, valid, menuId } = payload;

  switch (type) {
    case UPDATE_TEXT_FIELD:
      newState[TEXT_STORE_NAMESPACE][field] = { value, valid };
      return newState;
    case SELECT_TAB:
      newState[TAB_STORE_NAMESPACE][menuId] = value;
      return newState;
    default:
      return newState;
  }
}

module.exports = reduceInterface;
