/*
 * bwallet plugin-wide reducer
 * maintain shared state for this plugin
 */

const {
  USER_SELECT_WALLET,
  USER_SELECT_ACCOUNT,
  USER_SELECT_MULTISIG_PROPOSAL,
  APP_NAMESPACES,
} = require('../constants');

const {
  SELECTED_WALLET_NAMESPACE,
  SELECTED_WALLET_TYPE_NAMESPACE,
  SELECTED_ACCOUNT_NAMESPACE,
  SELECTED_PROPOSAL_NAMESPACE,
} = APP_NAMESPACES;

const initialState = {
  [SELECTED_WALLET_NAMESPACE]: null,
  [SELECTED_WALLET_TYPE_NAMESPACE]: null,
  [SELECTED_ACCOUNT_NAMESPACE]: null,
  [SELECTED_PROPOSAL_NAMESPACE]: null,
};

export default function appReducer(state = initialState, action) {
  const newState = { ...state };
  const { type, payload = {} } = action;

  const { walletId, accountId, proposalId, walletType } = payload;

  switch (type) {
    case USER_SELECT_WALLET:
      newState[SELECTED_WALLET_NAMESPACE] = walletId;
      newState[SELECTED_WALLET_TYPE_NAMESPACE] = walletType;
      return newState;

    case USER_SELECT_ACCOUNT:
      newState[SELECTED_ACCOUNT_NAMESPACE] = accountId;
      return newState;

    case USER_SELECT_MULTISIG_PROPOSAL:
      newState[SELECTED_PROPOSAL_NAMESPACE] = proposalId;
      return newState;

    default:
      return newState;
  }
}
