/*
 * bwallet plugin-wide reducer
 * maintain shared state for this plugin
 */

const {
  USER_SELECT_WALLET,
  USER_SELECT_ACCOUNT,
  SELECTED_WALLET_NAMESPACE,
  SELECTED_ACCOUNT_NAMESPACE,
  SELECTED_PROPOSAL_NAMESPACE,
  USER_SELECT_MULTISIG_PROPOSAL,
} = require('../constants');

const initialState = {
  [SELECTED_WALLET_NAMESPACE]: null,
  [SELECTED_ACCOUNT_NAMESPACE]: null,
  [SELECTED_PROPOSAL_NAMESPACE]: null,
};

export default function bwalletReducer(state = initialState, action) {
  const newState = { ...state };
  const { type, payload = {} } = action;

  const { walletId, accountId, proposalId } = payload;

  switch (type) {
    case USER_SELECT_WALLET:
      newState[SELECTED_WALLET_NAMESPACE] = walletId;
      return newState;

    case USER_SELECT_ACCOUNT:
      newState[SELECTED_ACCOUNT_NAMESPACE] = accountId;
      return newState;

    case USER_SELECT_MULTISIG_PROPOSAL:
      newState[SELECTED_PROPOSAL_NAMESPACE] = proposalId;
      return newState;

    default:
      return state;
  }
}
