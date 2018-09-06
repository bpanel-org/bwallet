const assert = require('bsert');
const { getClient } = require('@bpanel/bpanel-utils');

const { actionsLogger: logger } = require('../helpers');

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
    logger.debug(`fetching history for ${walletId}/${accountId}`);
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
    logger.debug(`fetching accounts for wallet ${walletId}`);
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
    logger.debug(`fetching account info for ${walletId}/${accountId}`);
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
    logger.debug(`fetching account balance for ${walletId}/${accountId}`);
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
    logger.debug(`creating account ${walletId}/${accountId}`);
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
    logger.debug(`fetching account info for ${walletId}/${accountId}`);
    const accountInfo = await client.wallet.getAccount(walletId, accountId);
    dispatch(setSelectAccount(accountId));
    dispatch(setAccountInfo(walletId, accountId, accountInfo));
  };
}

module.exports = {
  getAccountHistory,
  getAccounts,
  getAccountInfo,
  getAccountBalance,
  createAccount,
  selectAccount,
}
