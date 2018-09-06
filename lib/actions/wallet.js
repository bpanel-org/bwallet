const assert = require('bsert');
const { getClient } = require('@bpanel/bpanel-utils');

const { actionsLogger: logger } = require('../helpers');

const {
  SET_WALLETS,
  USER_SELECT_WALLET,
  SET_WALLET_INFO,
} = require('../constants');


function setWallets(wallets) {
  return {
    type: SET_WALLETS,
    payload: { wallets },
  }
};

function setSelectWallet(walletId) {
  return {
    type: USER_SELECT_WALLET,
    payload: { walletId },
  }
};

function setWalletInfo(walletId, walletInfo) {
  return {
    type: SET_WALLET_INFO,
    payload: { walletInfo, walletId },
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

    logger.debug(`getting ${type ? type : 'standard'} wallets`);
    let wallets = [];

    switch (type) {
      case 'multisig':
        wallets = wallets.concat(await client.multisig.getWallets());
        break;
      case 'standard':
      case undefined:
        wallets = wallets.concat(await client.wallet.getWallets());
        break;
      case 'all':
        wallets = wallets.concat(await client.wallet.getWallets());
        wallets = wallets.concat(await client.multisig.getWallets());
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
