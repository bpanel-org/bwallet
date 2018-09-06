const assert = require('bsert');
const { getClient } = require('@bpanel/bpanel-utils');

const { actionsLogger: logger } = require('../helpers');

const {
  SET_WALLET_HISTORY,
  SET_WALLETS,
  SET_WALLET_ACCOUNTS,
  USER_SELECT_WALLET,
  USER_SELECT_ACCOUNT,
  SET_WALLET_INFO,
  SET_WALLET_ACCOUNT_INFO,
  SET_WALLET_ACCOUNT_BALANCE,
} = require('../constants');

function setHistory(walletId, accountId, history) {
  return {
    type: SET_WALLET_HISTORY,
    payload: { walletId, accountId, history },
  }
};

function setWallets(wallets) {
  return {
    type: SET_WALLETS,
    payload: { wallets },
  }
};

function setAccounts(walletId, accounts) {
  return {
    type: SET_WALLET_ACCOUNTS,
    payload: { accounts, walletId },
  }
};

function setSelectWallet(walletId) {
  return {
    type: USER_SELECT_WALLET,
    payload: { walletId },
  }
};

function setSelectAccount(accountId) {
  return {
    type: USER_SELECT_ACCOUNT,
    payload: { accountId },
  }
};

function setWalletInfo(walletId, walletInfo) {
  return {
    type: SET_WALLET_INFO,
    payload: { walletInfo, walletId },
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
 * Get wallets using wallet client
 * @param {string} - type
 * @dispatches
 * @returns {void}
 */
function getWallets(type) {
  return async dispatch => {
    const client = getClient();

    logger.debug(`getting ${type} wallets`);
    const wallets = [];

    switch (type) {
      case 'multisig':
        wallets.concat(await client.multisig.getWallets());
        break;
      case 'default':
        wallets.concat(await client.wallet.getWallets());
        break;
      case 'all':
        wallets.concat(await client.wallet.getWallets());
        wallets.concat(await client.multisig.getWallets());
        break;
      default:
        logger.debug(`invalid argument getWallets(${type})`);
    }

    dispatch(setWallets(wallets));
  }
};

/**
 * User select wallet, fetch wallet info
 * @param {string} - walletId
 * @dispatches
 * @returns {void}
 */
function selectWallet(walletId) {
  return async dispatch => {
    const client = getClient();
    logger.debug(`selecting  wallet ${walletId}`);
    dispatch(setSelectWallet(walletId));
    const info = await client.wallet.getInfo(walletId);
    dispatch(setWalletInfo(walletId, info));
  }
}

/**
 * User create wallet, fetch wallet info
 * @param {string} - walletId
 * @param {Object} - options
 * @dispatches
 * @returns {void}
 */
function createWallet(walletId, options) {
  return async dispatch => {
    logger.debug(`creating wallet ${walletId}`);
    const client = getClient();
    const info = await client.wallet.createWallet(walletId, options);
    dispatch(setWalletInfo(walletId, info));
  }
}

module.exports = {
  getWallets,
  selectWallet,
  createWallet,
}
