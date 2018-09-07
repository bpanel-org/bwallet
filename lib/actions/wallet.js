const assert = require('bsert');
const { getClient } = require('@bpanel/bpanel-utils');

const { actionsLogger: logger } = require('../helpers');

const {
  SET_WALLETS,
  USER_SELECT_WALLET,
  SET_WALLET_INFO,
  USER_SELECT_MULTISIG_PROPOSAL,
  SET_MULTISIG_PROPOSAL_MTX,
  SET_MULTISIG_WALLETS,
  SET_MULTISIG_WALLET_INFO,
} = require('../constants');

function setWallets(wallets, walletType) {
  let type;
  if (walletType === 'multisig')
    type = SET_MULTISIG_WALLETS;
  else
    type = SET_WALLETS;

  return {
    type,
    payload: { wallets },
  }
};

function setSelectWallet(walletId, walletType) {
  let type;
  if (walletType === 'multisig')
    type = USER_SELECT_MULTISIG_WALLET;
  else
    type = USER_SELECT_WALLET;

  return {
    type,
    payload: { walletId },
  }
};

function setWalletInfo(walletId, info, walletType) {
  let type;
  if (walletType === 'multisig')
    type = SET_MULTISIG_WALLET_INFO;
  else
    type = SET_WALLET_INFO;

  return {
    type,
    payload: { info, walletId },
  }
};

// app wide...
function setSelectProposal(proposalId) {
  return {
    type: USER_SELECT_MULTISIG_PROPOSAL,
    payload: { proposalId },
  };
};

function setProposalMTX(walletId, proposalId, mtx) {
  return {
    type: SET_MULTISIG_PROPOSAL_MTX,
    payload: { walletId, proposalId, mtx },
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
    let multisigWallets = [];

    switch (type) {
      case undefined:
      case 'standard':
        wallets.push(...(await client.wallet.getWallets()));
        break;
      case 'multisig':
        multisigWallets.push(...(await client.multisig.getWallets()));
        break;
      case 'all':
        wallets.push(...(await client.wallet.getWallets()));
        multisigWallets.push(...(await client.multisig.getWallets()));
        break;
      default:
        logger.debug(`invalid argument getWallets(${type})`);
    }

    if (wallets.length)
      dispatch(setWallets(wallets))

    if (multisigWallets.length)
      dispatch(setWallets(multisigWallets, 'multisig'));
  }
};


/**
 * User select wallet, fetch wallet info
 * @param {string} - walletId
 * @param {string} - type
 * @dispatches
 * @returns {void}
 */
function selectWallet(walletId, type) {
  return async dispatch => {
    const client = getClient();
    logger.debug(`selecting ${type ? `${type} `: ''} wallet ${walletId}`);
    dispatch(setSelectWallet(walletId, type));
    let info;
    if (type === 'multisig')
      info = await client.multisig.getInfo(walletId);
    else
      info = await client.wallet.getInfo(walletId);
    dispatch(setWalletInfo(walletId, info, type));
  }
}

/**
 * User create wallet, fetch wallet info
 * @param {string} - walletId
 * @param {Object} - options
 * @dispatches
 * @returns {void}
 */
function createWallet(walletId, options, type) {
  return async dispatch => {
    logger.debug(`creating ${type ? `${type} ` : ''}wallet ${walletId}`);
    const client = getClient();
    let info;
    if (type === 'multisig')
      info = await client.multisig.createWallet(walletId, options);
    else
      info = await client.wallet.createWallet(walletId, options);
    dispatch(setWalletInfo(walletId, info, type));
  }
}

/**
 * fetch multisig proposal info
 * @param {string} - walletId
 * @param {string} - proposalId
 * @dispatches
 * @returns {void}
 */
function getProposalMTX(walletId, proposalId) {
  return async dispatch => {
    const { multisig } = getClient();
    const opts = { paths: true, scripts: true };
    const mtx = await multisig.getProposalMTX(walletId, proposalId, opts);
    dispatch(setProposalMTX(walletId, proposalId, mtx));
  };
}

/**
 * user select proposal, fetch multisig proposal info
 * @param {string} - walletId
 * @param {string} - proposalId
 * @dispatches
 * @returns {void}
 */
function selectProposal(walletId, proposalId) {
  return async dispatch => {
    const { multisig } = getClient();
    const opts = { paths: true, scripts: true };
    const mtx = await multisig.getProposalMTX(walletId, proposalId, opts);
    dispatch(setSelectProposal(proposalId));
    dispatch(setProposalMTX(walletId, proposalId, mtx));
  }
}

module.exports = {
  getWallets,
  selectWallet,
  createWallet,
  selectProposal,
  getProposalMTX,
}
