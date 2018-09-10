const assert = require('bsert');
const { getClient } = require('@bpanel/bpanel-utils');

const {
  SET_WALLET_HISTORY, // TODO: misleading name...
  SET_WALLET_ACCOUNT_INFO,
  SET_WALLET_ACCOUNT_BALANCE,
  SET_WALLET_ACCOUNTS,
  USER_SELECT_ACCOUNT,
} = require('../constants');

function setAccounts(walletId, accounts) {
  return {
    type: SET_WALLET_ACCOUNTS,
    payload: { accounts, walletId },
  }
};

function setAccountHistory(walletId, accountId, history) {
  return {
    type: SET_WALLET_HISTORY,
    payload: { walletId, accountId, history },
  }
};

function setSelectAccount(accountId) {
  return {
    type: USER_SELECT_ACCOUNT,
    payload: { accountId },
  }
};

function setAccountInfo(walletId, accountId, accountInfo) {
  return {
    type: SET_WALLET_ACCOUNT_INFO,
    payload: { walletId, accountId, accountInfo },
  }
};

function setAccountBalance(walletId, accountId, balance) {
  return {
    type: SET_WALLET_ACCOUNT_BALANCE,
    payload: { walletId, accountId, balance },
  }
};

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
};

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
  }
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
    const accountInfo = await client.wallet.createAccount(walletId, accountId, options);
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
 * @param {string} - options.walletType
 *   one of standard, undefined, multisig
 * @dispatches
 * @returns {void}
 *
 * TODO: may want to assert not multisig
 *       to prevent multisigdb edgecases
 */

const SUPPORTED_ADDRESS_TYPES = ['receive', 'change', 'nested'];
const SUPPORTED_WALLET_TYPES = ['standard', 'multisig', undefined];

function createAddress(walletId, accountId, options) {
  assert(SUPPORTED_ADDRESS_TYPES.includes(options.addressType));
  assert(SUPPORTED_WALLET_TYPES.includes(options.walletType));

  return async dispatch => {
    const clients = getClient();
    // selet client based on wallet type
    if (options.walletType === 'multisig')
      client = clients.multisig;
    else
      client = clients.wallet;

    if (type === 'receive')
      await client.wallet.createAddress(walletId, accountId);
    else if (type === 'change')
      await client.createChange(walletId, accountId);
    else if (type === 'nested')
      await client.createNested(walletId, accountId);

    const accountInfo = await client.getAccount(walletId, accountId);
    dispatch(setAccountInfo(walletId, accountId, accountInfo));
  };
};

module.exports = {
  getAccountHistory,
  getAccounts,
  getAccountInfo,
  getAccountBalance,
  createAccount,
  selectAccount,
}
