const assert = require('bsert');
const { base58 } = require('bstring');
const { getClient } = require('@bpanel/bpanel-utils');

import { getxpub } from '../utilities';
import {
  selectWallets,
  selectMultisigWallets,
  selectCurrentChain,
  selectNetwork,
} from '../mappings/selectors';


const {
  SET_WALLETS,
  USER_SELECT_WALLET,
  SET_WALLET_INFO,
  USER_SELECT_MULTISIG_PROPOSAL,
  SET_MULTISIG_PROPOSAL_MTX,
  SET_MULTISIG_WALLETS,
  SET_MULTISIG_WALLET_INFO,
} = require('../constants');

const { setAccounts } = require('./account');

function setWallets(wallets, walletType) {
  let type;
  if (walletType === 'multisig') type = SET_MULTISIG_WALLETS;
  else type = SET_WALLETS;

  return {
    type,
    payload: { wallets },
  };
}

function setSelectWallet(walletId) {
  // user can only select 1 wallet at a time, don't keep track of type
  return {
    type: USER_SELECT_WALLET,
    payload: { walletId },
  };
}

function setWalletInfo(walletId, info, walletType) {
  let type;
  if (walletType === 'multisig') type = SET_MULTISIG_WALLET_INFO;
  else type = SET_WALLET_INFO;

  return {
    type,
    payload: { info, walletId },
  };
}

function setSelectProposal(proposalId) {
  return {
    type: USER_SELECT_MULTISIG_PROPOSAL,
    payload: { proposalId },
  };
}

function setProposalMTX(walletId, proposalId, mtx) {
  return {
    type: SET_MULTISIG_PROPOSAL_MTX,
    payload: { walletId, proposalId, mtx },
  };
}

/**
 * Get wallets using wallet client
 * @param {string} - type
 * @dispatches
 * @returns {void}
 *
 * NOTE: multisig client returns multisig specific wallets
 * wallet client returns both standard wallets and multisig
 * wallets. multisig wallets returned from standard client
 * look like watch only wallets
 */
function getWallets() {
  return async dispatch => {
    const { wallet, multisig } = getClient();

    // wallet.getWallets returns all wallets, including multisig
    // multisig.getWallets returns only multisig wallets
    const [wallets, multisigs] = await Promise.all([
      wallet.getWallets(),
      multisig.getWallets(),
    ]);

    // filter to only standard wallets
    const standard = wallets.filter(w => !multisigs.includes(w));

    if (standard.length) dispatch(setWallets(standard));

    if (multisigs.length) dispatch(setWallets(multisigs, 'multisig'));
  };
}

/**
 * User select wallet, fetch wallet info
 * @param {string} - walletId
 * @param {string} - type
 * @dispatches
 * @returns {void}
 *
 * NOTE: multisig wallets don't have concept
 * of accounts
 */
function selectWallet(walletId, type) {
  return async dispatch => {
    const { wallet, multisig } = getClient();
    dispatch(setSelectWallet(walletId));
    let info, accounts;
    if (type === 'multisig') {
      info = await multisig.getInfo(walletId);
      accounts = [];
    } else {
      info = await wallet.getInfo(walletId);
      accounts = await wallet.getAccounts(walletId);
    }

    dispatch(setAccounts(walletId, accounts, type));
    dispatch(setWalletInfo(walletId, info, type));
  };
}

/**
 * fetch wallet info
 * @param {string} - walletId
 * @param {string} - type
 * @dispatches
 * @returns {void}
 */
function getWalletInfo(walletId, type) {
  return async dispatch => {
    const client = getClient();
    let info;
    if (type === 'multisig')
      info = await client.multisig.getInfo(walletId, true);
    else info = await client.wallet.getInfo(walletId);
    dispatch(setWalletInfo(walletId, info, type));
  };
}

/**
 * fetch info for each wallet in state
 * @param {void}
 * @dispatches
 * @returns {void}
 *
 * NOTE: depends on wallets already being in state
 */
function getWalletsInfo() {
  return async (dispatch, getState) => {
    const { wallet, multisig } = getClient();
    const state = getState();
    const wallets = selectWallets(state);
    const multisigs = selectMultisigWallets(state);

    // fetch info for each standard wallet
    // then fetch info for each multisig wallet
    {
      const promises = wallets.map(wid => wallet.getInfo(wid));
      const results = await Promise.all(promises);
      for (let i = 0; i < promises.length; i++)
        dispatch(setWalletInfo(wallets[i], results[i]));
    }
    {
      const promises = multisigs.map(wid => multisig.getInfo(wid));
      const results = await Promise.all(promises);
      for (let i = 0; i < promises.length; i++)
        dispatch(setWalletInfo(multisigs[i], results[i], 'multisig'));
    }
  };
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
    if (options.accountKey)
      assert(base58.test(options.accountKey), 'xpub must be base58');

    const client = getClient();
    let info;
    if (type === 'multisig')
      info = await client.multisig.createWallet(walletId, options);
    else info = await client.wallet.createWallet(walletId, options);

    dispatch(setWalletInfo(walletId, info, type));
  };
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
  };
}

function joinWallet(options) {
  return async (dispatch, getState) => {
    const { multisig } = getClient();
    const state = getState();
    const chain = selectCurrentChain(state);
    const network = selectNetwork(state);

    const { walletId, cosignerId, joinKey, hardwareType } = options;
    let { account } = options;

    assert(walletId)
    assert(cosignerId)
    assert(joinKey)
    assert(account)
    assert(hardwareType)

    if (typeof account === 'string')
      account = parseInt(account, 10);

    const options = {
      chain,
      network,
      account,
      hardwareType,
    }
    const { xpub, path } = await getxpub(options);

    // now join wallet
    const result = await multisig.joinWallet(walletId, {
      walletName: walletId,
      cosignerName: cosignerId,
      cosignerPath: path,
      joinKey: joinKey,
      xpub: xpub,
    });

    console.log(result);

    await getWalletInfo(walletId, 'multisig');
  }
}

module.exports = {
  getWallets,
  getWalletInfo,
  getWalletsInfo,
  selectWallet,
  createWallet,
  selectProposal,
  getProposalMTX,
  joinWallet,
};
