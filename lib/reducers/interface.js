const {
  INTERFACE_NAMESPACES,
  UPDATE_TEXT_FIELD,
  SELECT_TAB,
} = require('../constants');
const { TEXT_STORE_NAMESPACE, TAB_STORE_NAMESPACE } = INTERFACE_NAMESPACES;

// TODO: modularize this
const BWALLET_ERROR = 'BWALLET_ERROR';
const IS_ERROR_NAMESPACE = 'isError';
const ERROR_METADATA_NAMESPACE = 'errorMetadata';

const initialState = {
  [TEXT_STORE_NAMESPACE]: {},
  [TAB_STORE_NAMESPACE]: {},
  [IS_ERROR_NAMESPACE]: false,
  [ERROR_METADATA_NAMESPACE ]: {},
};

function reduceInterface(state = initialState, action) {
  let newState = { ...state };
  const { type, payload = {} } = action;

  const { field, value, valid, menuId, metadata = {} } = payload;

  switch (type) {
    case UPDATE_TEXT_FIELD:
      newState[TEXT_STORE_NAMESPACE][field] = { value, valid };
      return newState;
    case SELECT_TAB:
      newState[TAB_STORE_NAMESPACE][menuId] = value;
      return newState;
    case BWALLET_ERROR:
      // reverse error state
      newState[IS_ERROR_NAMESPACE] = !newState[IS_ERROR_NAMESPACE];
      newState[ERROR_METADATA_NAMESPACE] = metadata;
      return newState;
    default:
      return newState;
  }
}

module.exports = reduceInterface;
