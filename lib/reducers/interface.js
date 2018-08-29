const { UPDATE_TEXT_FIELD, TEXT_STORE_KEY } = require('../constants');

const initialState = {
  [TEXT_STORE_KEY]: {},
};

function reduceInterface(state = initialState, action) {
  const { type, payload = {} } = action;

  let newState = { ...state };

  const { field, value, valid } = payload;

  switch (type) {
    case UPDATE_TEXT_FIELD:
      newState[TEXT_STORE_KEY][field] = { value, valid };
      return newState;
    default:
      return state;
  }
}

module.exports = {
  reduceInterface,
};
