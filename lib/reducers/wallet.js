/*
 * bwallet blockchain wallet reducer
 * maintains information specific to a
 * blockchain node
 */

const {
  helpers: { safeSet },
} = require('@bpanel/bpanel-utils');

const {
  // actions
  SET_WALLETS,
  SET_WALLET_INFO,
  SET_WALLET_HISTORY,
  SET_WALLET_ACCOUNT_INFO,
  SET_WALLET_ACCOUNT_BALANCE,
  SET_WALLET_ACCOUNTS,
  SET_MULTISIG_WALLETS,
  SET_MULTISIG_WALLET_INFO,
  SET_MULTISIG_PROPOSAL_MTX,
  SET_MULTISIG_WALLET_ACCOUNTS,
  SET_MULTISIG_WALLET_ACCOUNT_INFO,
  SEND_TX_STATUS_FAILURE,
  SEND_TX_STATUS_SUCCESS,

  // namespaces
  WALLETS_NAMESPACES,
} = require('../constants');

const {
  WALLETS_NAMESPACE,
  MULTISIG_WALLETS_NAMESPACE,
  WALLET_INFO_NAMESPACE,
  MULTISIG_WALLET_INFO_NAMESPACE,
  MULTISIG_PROPOSAL_NAMESPACE,
  ACCOUNT_INFO_NAMESPACE,
  MULTISIG_ACCOUNT_INFO_NAMESPACE,
  BALANCE_NAMESPACE,
  ACCOUNTS_NAMESPACE,
  HISTORY_NAMESPACE,
  MULTISIG_ACCOUNTS_NAMESPACE,
  TX_STATUS_SUCCESS_NAMESPACE,
  TX_STATUS_FAILURE_NAMESPACE,
} = WALLETS_NAMESPACES;

const initialState = {
  [WALLETS_NAMESPACE]: [],
  [MULTISIG_WALLETS_NAMESPACE]: [],
  [WALLET_INFO_NAMESPACE]: {},
  [MULTISIG_WALLET_INFO_NAMESPACE]: {},
  [ACCOUNT_INFO_NAMESPACE]: {},
  [BALANCE_NAMESPACE]: {},
  [ACCOUNTS_NAMESPACE]: {},
  [HISTORY_NAMESPACE]: {},
  [MULTISIG_PROPOSAL_NAMESPACE]: [],
  [MULTISIG_ACCOUNT_INFO_NAMESPACE]: {},
  [MULTISIG_ACCOUNTS_NAMESPACE]: {},
  [TX_STATUS_SUCCESS_NAMESPACE]: {},
  [TX_STATUS_FAILURE_NAMESPACE]: {},
};

export default function reduceWallets(state = initialState, action) {
  const newState = { ...state };
  const { type, payload = {} } = action;

  const {
    walletId,
    info,
    wallets,
    history,
    accountId,
    accountInfo,
    accounts,
    balance,
    proposalId,
    mtx,
    txid,
    response,
    options,
  } = payload;

  switch (type) {
    case SET_WALLETS:
      return safeSet(newState, `${WALLETS_NAMESPACE}`, wallets);

    case SET_WALLET_INFO:
      return safeSet(newState, `${WALLET_INFO_NAMESPACE}.${walletId}`, info);

    case SET_MULTISIG_WALLET_INFO:
      return safeSet(
        newState,
        `${MULTISIG_WALLET_INFO_NAMESPACE}.${walletId}`,
        info
      );

    case SET_WALLET_HISTORY:
      return safeSet(
        newState,
        `${HISTORY_NAMESPACE}.${walletId}.${accountId}`,
        history
      );

    case SET_WALLET_ACCOUNT_INFO:
      return safeSet(
        newState,
        `${ACCOUNT_INFO_NAMESPACE}.${walletId}.${accountId}`,
        accountInfo
      );

    case SET_WALLET_ACCOUNT_BALANCE:
      return safeSet(
        newState,
        `${BALANCE_NAMESPACE}.${walletId}.${accountId}`,
        balance
      );

    case SET_WALLET_ACCOUNTS:
      return safeSet(newState, `${ACCOUNTS_NAMESPACE}.${walletId}`, accounts);

    case SET_MULTISIG_WALLET_ACCOUNT_INFO:
      return safeSet(
        newState,
        `${MULTISIG_ACCOUNT_INFO_NAMESPACE}.${walletId}`,
        accounts
      );

    case SET_MULTISIG_WALLETS:
      return safeSet(newState, `${MULTISIG_WALLETS_NAMESPACE}`, wallets);

    case SET_MULTISIG_WALLET_ACCOUNTS:
      return safeSet(
        newState,
        `${MULTISIG_ACCOUNTS_NAMESPACE}.${walletId}`,
        accounts
      );

    case SET_MULTISIG_PROPOSAL_MTX:
      return safeSet(
        newState,
        `${MULTISIG_PROPOSAL_NAMESPACE}.${walletId}.${proposalId}`,
        mtx
      );

    case SEND_TX_STATUS_SUCCESS:
      return safeSet(newState, `${TX_STATUS_SUCCESS_NAMESPACE}.${walletId}.${accountId}.${txid}`, response);

    // appends failed tx to list of failed tx for wallet/account
    case SEND_TX_STATUS_FAILURE: {
      // look before you leap
      debugger;
      const namespace = newState[TX_STATUS_FAILURE_NAMESPACE];
      if (!(walletId in namespace))
        namespace[walletId] = {};
      if (!(accountId in namespace[walletId]))
        namespace[walletId][accountId] = [];

      const failedTxs = namespace[walletId][accountId];
      newState[TX_STATUS_FAILURE_NAMESPACE][walletId][accountId] = [...failedTxs, options]
      return newState;
    }

    default:
      return newState;
  }
}
