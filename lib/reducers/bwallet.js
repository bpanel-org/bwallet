/*
 * bwallet plugin-wide reducer
 * maintain shared state for this plugin
 */

const {
  USER_SELECT_WALLET,
} = require('../constants');

const initialState = {
  selectedWallet: null,
  selectedAccount: null,
};

export default function bwalletReducer(state = initialState, action) {
  const { type, payload } = action;

  const {
    walletId,
    accountId,
  } = payload;

  switch (type) {
    case USER_SELECT_WALLET:
      newState.selectedWallet = walletId;
      return newState;

    case USER_SELECT_ACCOUNT:
      newState.selectedAccount = accountId;
      break;

    default:
      return state;
  }
}
