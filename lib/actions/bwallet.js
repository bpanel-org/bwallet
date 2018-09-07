/*
 * application wide actions
 * manages application state
 */

const {
  USER_SELECT_XPUB,
} = require('../constants');

function selectXPUB(xpub) {
  return {
    type: USER_SELECT_XPUB,
    payload: { selectedXPUB: xpub },
  };
};

module.exports = {
  selectXPUB,
}
