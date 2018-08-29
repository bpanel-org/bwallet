const { UPDATE_TEXT_FIELD } = require('../constants');

const updateTextField = (field, value, valid) => {
  return {
    type: UPDATE_TEXT_FIELD,
    payload: { field, value, valid },
  };
};

module.exports = {
  updateTextField,
};
