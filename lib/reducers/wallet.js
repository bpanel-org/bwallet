/*
 * bwallet blockchain wallet reducer
 * maintains information specific to a
 * blockchain node
 */

const { helpers: { safeSet } } = require('@bpanel/bpanel-utils');

const { reducersLogger: logger } = require('../helpers');

const {
  // actions
  SET_WALLETS,
  USER_SELECT_WALLET,
  SET_WALLET_INFO,
  SET_WALLET_HISTORY,
  SET_WALLET_ACCOUNT_INFO,
  SET_WALLET_ACCOUNT_BALANCE,
  SET_WALLET_ACCOUNTS,
  // namespaces
  HISTORY_NAMESPACE,
  WALLETS_NAMESPACE,
  WALLET_INFO_NAMESPACE,
  ACCOUNT_INFO_NAMESPACE,
  BALANCE_NAMESPACE,
  ACCOUNTS_NAMESPACE,
} = require('../constants');

const initialState = {
  [HISTORY_NAMESPACE]: {},
  [WALLETS_NAMESPACE]: [],
  [WALLET_INFO_NAMESPACE]: {},
  [ACCOUNT_INFO_NAMESPACE]: {},
  [BALANCE_NAMESPACE]: {},
  [ACCOUNTS_NAMESPACE]: {},
};

export default function reduceWallets(state = initialState, action) {
  const newState = { ...state };
  const { type, payload = {} } = action;

  logger.debug(`[wallets] ${type}`);

  const {
    walletId,
    walletInfo,
    wallets,
    history,
    accountId,
    accountInfo,
    accounts,
  } = payload;

  switch (type) {
    case SET_WALLETS:
      return safeSet(newState, `${WALLETS_NAMESPACE}`, wallets);

    case SET_WALLET_INFO:
      return safeSet(newState, `${WALLET_INFO_NAMESPACE}.${walletId}`, walletInfo);

    case SET_WALLET_HISTORY:
      return safeSet(newState, `${HISTORY_NAMESPACE}.${walletId}.${accountId}`, history);

    case SET_WALLET_ACCOUNT_INFO:
      return safeSet(newState, `${ACCOUNT_INFO_NAMESPACE}.${walletId}.${accountId}`, accountInfo);

    case SET_WALLET_ACCOUNT_BALANCE:
      return safeSet(newState, `${BALANCE_NAMESPACE}.${walletId}.${accountId}`, balance);

    case SET_WALLET_ACCOUNTS:
      return safeSet(newState, `${ACCOUNTS_NAMESPACE}.${walletId}`, accounts);

    default:
      logger.debug('[wallets] WARNING: default case hit');
      return state;
  }
}

