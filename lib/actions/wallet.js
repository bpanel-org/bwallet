const assert = require('bsert');
const { base58 } = require('bstring');
const { getClient } = require('@bpanel/bpanel-utils');
import {
  selectWallets,
  selectMultisigWallets,
  selectNetwork,
  selectCurrentChain,
} from '../mappings/selectors';
import { getAccountInfo } from './account';
import { getxpub } from '../utilities';

const {
  SET_WALLETS,
  USER_SELECT_WALLET,
  SET_WALLET_INFO,
  USER_SELECT_MULTISIG_PROPOSAL,
  SET_MULTISIG_PROPOSAL_MTX,
  SET_MULTISIG_WALLETS,
  SET_MULTISIG_WALLET_INFO,
  SEND_TX_STATUS_SUCCESS,
  SEND_TX_STATUS_FAILURE,
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

function setSelectWallet(walletId, walletType) {
  return {
    type: USER_SELECT_WALLET,
    payload: { walletId, walletType },
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

function setSendTXSuccess(walletId, accountId, txid, response) {
  return {
    type: SEND_TX_STATUS_SUCCESS,
    payload: { walletId, accountId, txid, response },
  };
}

function setSendTXFailure(walletId, accountId, options) {
  // defensively prevent "passphrase" from ending up in store
  if ('passphrase' in options) options.passphrase = '';

  return {
    type: SEND_TX_STATUS_FAILURE,
    payload: { walletId, accountId, options },
  };
}

/**
 * Get wallets using wallet client
 * @dispatches
 * @returns {void}
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
 */
function selectWallet(walletId, type) {
  return async dispatch => {
    dispatch(setSelectWallet(walletId, type));

    const { wallet, multisig } = getClient();
    let info, accounts;
    if (type === 'multisig') {
      info = await multisig.getInfo(walletId);
      // multisig wallets only have default account
      accounts = ['default'];
    } else {
      info = await wallet.getInfo(walletId);
      accounts = await wallet.getAccounts(walletId);
    }

    dispatch(setAccounts(walletId, accounts, type));
    dispatch(setWalletInfo(walletId, info, type));

    // get info for each account
    // TODO: test with many accounts
    for (let account of accounts) dispatch(getAccountInfo(walletId, account));
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
 * create multisig wallet using xpub then fetch wallet info
 * @param {string} - walletId
 * @param {Object} - options
 * @dispatches
 * @returns {void}
 *
 * TODO: this could probably be generalized into createWallet fn
 */
function getxpubCreateMultisigWallet(walletId, options) {
  return async function action(dispatch) {
    const { xpub, path } = await getxpub({
      chain: options.chain,
      network: options.network,
      account: options.account,
      hardwareType: options.hardwareType,
      path: options.path,
    });

    const { m, n, cosignerName } = options;

    assert(walletId, 'must pass wallet id');
    assert(cosignerName, 'must pass a cosigner name');
    assert(m, 'must pass m');
    assert(n, 'must pass n');

    dispatch(
      createWallet(
        walletId,
        {
          m: parseInt(m, 10),
          n: parseInt(n, 10),
          cosignerName,
          xpub,
          cosignerPath: path,
        },
        'multisig'
      )
    );
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

/**
 * join wallet
 * @param {string} - walletId
 * @param {object} - options
 * @param {string} - options.cosignerId
 * @param {string} - options.joinKey
 * @param {string} - options.hardwareType
 * @param {string|number} - options.account - bip44 account index
 * @dispatches
 * @returns {void}
 */
function joinWallet(walletId, options) {
  return async (dispatch, getState) => {
    const { multisig } = getClient();
    const state = getState();
    const chain = selectCurrentChain(state);
    const network = selectNetwork(state);

    const { cosignerId, joinKey, hardwareType } = options;
    let { account } = options;

    assert(walletId, 'must pass wallet id');
    assert(cosignerId, 'must pass cosigner id');
    assert(joinKey, 'must pass join key');
    assert(account, 'must pass account');
    assert(hardwareType, 'must pass hardware type');

    if (typeof account === 'string') account = parseInt(account, 10);

    const { xpub, path } = await getxpub({
      chain,
      network,
      account,
      hardwareType,
    });

    // TODO: parse cosigner token from response here
    // otherwise it can get lost
    await multisig.joinWallet(walletId, {
      walletName: walletId,
      cosignerName: cosignerId,
      cosignerPath: path,
      joinKey: joinKey,
      xpub: xpub,
    });

    dispatch(getWalletInfo(walletId, 'multisig'));
  };
}

/**
 * send a transaction
 * @param {string} - walletId
 * @param {object} - options
 * @param {string} - options.passphrase
 * @param {string} - options.value
 * @param {string} - options.address
 * @param {string} - options.accountId
 * @dispatches
 * @returns {void}
 */
function sendTX(walletId, options) {
  return async dispatch => {
    const { wallet } = getClient();
    const { passphrase, value, address, accountId } = options;
    let { rate } = options;

    if (typeof rate === 'string') rate = parseInt(rate, 10);

    assert(passphrase, 'must enter passphrase');
    assert(rate, 'must enter rate');
    assert(value, 'must enter value');
    assert(address, 'must enter recipient address');

    const opts = {
      passphrase,
      rate,
      outputs: [{ value, address }],
    };

    try {
      const response = await wallet.send(walletId, opts);
      const txid = response.hash;
      dispatch(setSendTXSuccess(walletId, accountId, txid, response));
    } catch (e) {
      dispatch(
        setSendTXFailure(walletId, accountId, {
          message: e.message,
          rate: opts.rate,
          outputs: opts.outputs,
        })
      );

      // propagate error message
      throw e;
    }
  };
}

module.exports = {
  getWallets,
  getWalletInfo,
  getxpubCreateMultisigWallet,
  getWalletsInfo,
  selectWallet,
  joinWallet,
  createWallet,
  selectProposal,
  getProposalMTX,
  sendTX,
};
