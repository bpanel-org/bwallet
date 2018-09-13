/*
 * bwallet plugin-wide reducer
 * maintain shared state for this plugin
 */

const {
  USER_SELECT_WALLET,
  USER_SELECT_ACCOUNT,
  USER_SELECT_MULTISIG_PROPOSAL,
  USER_SELECT_WALLET_TYPE,
  SET_SIGNING_STATUS,

  SIGNING_STATUS_NAMESPACE,
  SELECTED_WALLET_NAMESPACE,
  SELECTED_ACCOUNT_NAMESPACE,
  SELECTED_PROPOSAL_NAMESPACE,
  SELECTED_WALLET_TYPE_NAMESPACE

} = require('../constants');


const initialState = {
  [SELECTED_WALLET_NAMESPACE]: null,
  [SELECTED_ACCOUNT_NAMESPACE]: null,
  [SELECTED_PROPOSAL_NAMESPACE]: null,
  [SIGNING_STATUS_NAMESPACE]: {},
  [SELECTED_WALLET_TYPE_NAMESPACE]: null,
};

export default function bwalletReducer(state = initialState, action) {
  const newState = { ...state };
  const { type, payload } = action;

  const {
    walletId,
    accountId,
    proposalId,
    walletType,
    status,
    cosignerId,
  } = payload;

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

    case USER_SELECT_WALLET_TYPE:
      newState[SELECTED_WALLET_TYPE_NAMESPACE] = walletType;
      return newState;

    case SET_SIGNING_STATUS: {
      const statuses = newState[SIGNING_STATUS_NAMESPACE];
      // look before you leap
      if (!(walletId in statuses))
        statuses[walletId] = {};
      const proposals = statuses[walletId];
      if (!(proposalId in proposals))
        proposals[proposalId] = {};

      const proposal = proposals[proposalId];
      proposal[cosignerId] = status;
      return newState;
    }

    default:
      return state;
  }
}
