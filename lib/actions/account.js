import assert from 'bsert';
import { getxpub } from '../utilities';

// monkey patching with rewire requires require statement
// will not work with import
const { getClient } = require('@bpanel/bpanel-utils');

import {
  SET_WALLET_HISTORY, // TODO: misleading name...
  SET_WALLET_ACCOUNT_INFO,
  SET_WALLET_ACCOUNT_BALANCE,
  SET_WALLET_ACCOUNTS,
  USER_SELECT_ACCOUNT,
  SET_MULTISIG_WALLET_ACCOUNTS,
} from '../constants';

function setAccounts(walletId, accounts, walletType) {
  let type;
  if (walletType === 'multisig') type = SET_MULTISIG_WALLET_ACCOUNTS;
  else type = SET_WALLET_ACCOUNTS;
  return {
    type,
    payload: { accounts, walletId },
  };
}

function setAccountHistory(walletId, accountId, history) {
  return {
    type: SET_WALLET_HISTORY,
    payload: { walletId, accountId, history },
  };
}

function setSelectAccount(accountId) {
  return {
    type: USER_SELECT_ACCOUNT,
    payload: { accountId },
  };
}

function setAccountInfo(walletId, accountId, accountInfo) {
  return {
    type: SET_WALLET_ACCOUNT_INFO,
    payload: { walletId, accountId, accountInfo },
  };
}

function setAccountBalance(walletId, accountId, balance) {
  return {
    type: SET_WALLET_ACCOUNT_BALANCE,
    payload: { walletId, accountId, balance },
  };
}

/**
 * fetch account transaction history
 * @param {string} - walletId
 * @param {string} - accountId
 * @dispatches
 * @returns {void}
 *
 * TODO: add pagination
 */
function getAccountHistory(walletId, accountId) {
  return async dispatch => {
    const client = getClient();
    const history = await client.wallet.getHistory(walletId, accountId);
    dispatch(setAccountHistory(walletId, accountId, history));
  };
}

/**
 * fetch accounts by wallet id
 * @param {string} - walletId
 * @dispatches
 * @returns {void}
 */
function getAccounts(walletId) {
  return async dispatch => {
    const client = getClient();
    const accounts = await client.wallet.getAccounts(walletId);
    dispatch(setAccounts(walletId, accounts));
  };
}

/**
 * fetch account info
 * @param {string} - walletId
 * @param {string} - accountId
 * @dispatches
 * @returns {void}
 */
function getAccountInfo(walletId, accountId) {
  return async dispatch => {
    const client = getClient();
    const accountInfo = await client.wallet.getAccount(walletId, accountId);
    dispatch(setAccountInfo(walletId, accountId, accountInfo));
  };
}

/**
 * fetch account balance
 * @param {string} - walletId
 * @param {string} - accountId
 * @dispatches
 * @returns {void}
 */
function getAccountBalance(walletId, accountId) {
  return async dispatch => {
    const client = getClient();
    const balance = await client.wallet.getBalance(walletId, accountId);
    dispatch(setAccountBalance(walletId, accountId, balance));
  };
}

/**
 * create account
 * @param {string} - walletId
 * @param {string} - accountId
 * @param {object} - options
 * @dispatches
 * @returns {void}
 */
function createAccount(walletId, accountId, options) {
  return async dispatch => {
    const client = getClient();
    const accountInfo = await client.wallet.createAccount(
      walletId,
      accountId,
      options
    );
    dispatch(setAccountInfo(walletId, accountId, accountInfo));
  };
}

/**
 * fetch account info and set selected account
 * @param {string} - walletId
 * @param {string} - accountId
 * @dispatches
 * @returns {void}
 */
function selectAccount(walletId, accountId) {
  return async dispatch => {
    const client = getClient();
    const accountInfo = await client.wallet.getAccount(walletId, accountId);
    dispatch(setSelectAccount(accountId));
    dispatch(setAccountInfo(walletId, accountId, accountInfo));
  };
}

/**
 * create address and refresh account info
 * @param {string} - walletId
 * @param {string} - accountId
 * @param {object} - options
 * @param {string} - options.addressType
 *   one of receive, change, nested
 * @dispatches
 * @returns {void}
 */

function createAddress(walletId, accountId, options) {
  return async dispatch => {
    let { wallet } = getClient();
    wallet = wallet.wallet(walletId);

    if (options.addressType === 'receive')
      await wallet.createAddress(accountId);
    else if (options.addressType === 'change')
      await wallet.createChange(accountId);
    else if (options.addressType === 'nested')
      await wallet.createNested(accountId);

    const accountInfo = await wallet.getAccount(accountId);
    dispatch(setAccountInfo(walletId, accountId, accountInfo));
  };
}

/**
 * import public or private key
 * @param {string} - type
 *   public or private
 * @param {Object} options
 * @param {string} options.walletId - wallet to import into
 * @param {string} options.accountId - account to create
 * @param {string} options.key - public or private key
 * @dispatches
 * @returns {void}
 */
function importKey(type, options) {
  assert(type === 'private' || type === 'public');
  assert(options.walletId);
  assert(options.accountId);
  assert(options.key);
  // TODO: add assertion around validity of key
  const { walletId, accountId, key } = options;
  return async dispatch => {
    const { wallet } = getClient();
    if (type === 'private')
      await wallet.importPrivate(walletId, accountId, key);
    else if (type === 'public')
      await wallet.importPublic(walletId, accountId, key);

    const accountInfo = await wallet.getAccount(walletId, accountId);
    dispatch(setAccountInfo(walletId, accountId, accountInfo));
  };
}

/*
 * getxpub then create account using the xpub
 * @param {string} walletId
 * @param {string} accountId
 * @param {object} options
 * @param {string} options.chain
 * @param {string} options.network
 * @param {string} options.account
 * @param {string} options.hardwareType
 */
async function getxpubCreateWatchOnly(walletId, accountId, options) {
  return async function action(dispatch) {
    const { xpub } = await getxpub({
      chain: options.chain,
      network: options.network,
      account: options.account,
      hardwareType: options.hardwareType,
    });

    assert(walletId, 'must pass wallet id');
    assert(accountId, 'must pass account id');

    dispatch(
      createAccount(walletId, accountId, {
        watchOnly: true,
        xpub,
      })
    );
  };
}

export {
  createAddress,
  getAccountHistory,
  getAccounts,
  getAccountInfo,
  getAccountBalance,
  createAccount,
  selectAccount,
  importKey,
  setAccounts,
  getxpubCreateWatchOnly,
};
