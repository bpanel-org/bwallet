const { UPDATE_TEXT_FIELD } = require('../constants');

const initialState = {
  textFields: {},
};

function reduceInterface(state = initialState, action) {
  const { type, payload = {} } = action;

  let newState = { ...state };

  const {
    field,
    value,
    valid,
  } = payload;

  switch (type) {
    case UPDATE_TEXT_FIELD:
      newState.textFields[field] = { value, valid };
      return newState;
    default:
      return state;
  }
}

module.exports = {
  reduceInterface,
};
