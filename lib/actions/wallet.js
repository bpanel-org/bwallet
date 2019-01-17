const assert = require('bsert');
const { base58 } = require('bstring');
const { getClient } = require('@bpanel/bpanel-utils');
import {
  selectWallets,
  selectMultisigWallets,
  selectNetwork,
  selectCurrentChain,
  selectCurrentClientServices,
} from '../mappings/selectors';
import { getAccountInfo } from './account';
import { selectTab } from './interface';
import {
  getxpub,
  getHardwareSignatures,
  templateBIP44Account,
  signTransaction,
  toHDPublicKey,
  toTX,
} from '../utilities';

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
  SET_TEMPORARY_SECRETS,
  SET_MULTISIG_WALLET_PROPOSALS,
  CLEAR_TEMPORARY_SECRETS,
  HARDENED_INDEX,
  CLEAR_ALL_WALLETS,
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

// clears wallets and multisig wallets
// from the store
function clearAllWallets() {
  return {
    type: CLEAR_ALL_WALLETS,
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

function setMultisigProposals(walletId, proposals) {
  return {
    type: SET_MULTISIG_WALLET_PROPOSALS,
    payload: { walletId, proposals },
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
function getWallets(type = 'all') {
  return async (dispatch, getState) => {
    const { wallet, multisig } = getClient();

    const state = getState();
    const services = selectCurrentClientServices(state);

    let standard = [];
    let ms = [];

    // TODO: there is a race condition in which
    // services can be undefined before it is populated
    // by the back end
    if (!services) return;
    // fetch both standard wallets and multisig wallets
    // in parallel if both services are enabled
    if (type === 'all' && services.wallet && services.multisig) {
      // wallet.getWallets returns all wallets, including multisig
      // multisig.getWallets returns only multisig wallets
      const fetchWallets = [];
      if (services.wallet && wallet) fetchWallets.push(wallet.getWallets());
      if (services.multisig && multisig)
        fetchWallets.push(multisig.getWallets());
      const [wallets, multisigs] = await Promise.all(fetchWallets);

      // filter to only standard wallets
      if (multisigs) standard = wallets.filter(w => !multisigs.includes(w));
      else standard = wallets;
      ms = multisigs;

      // only fetch standard wallets if no multisig service
    } else if (services.wallet) {
      standard = await wallet.getWallets();
    }

    if (standard.length) dispatch(setWallets(standard));
    if (ms && ms.length) dispatch(setWallets(ms, 'multisig'));
  };
}

/**
 * User select wallet, fetch wallet info
 * @param {string} - walletId
 * @param {string} - type
 * @param {object} - options
 * @param {bool} - options.proposals
 * @dispatches
 * @returns {void}
 */
function selectWallet(walletId, type, options = {}) {
  return async dispatch => {
    dispatch(setSelectWallet(walletId, type));

    const { wallet, multisig } = getClient();
    let info, accounts;
    if (type === 'multisig') {
      info = await multisig.getInfo(walletId);
      // multisig wallets only have default account
      accounts = ['default'];

      if (options.proposals) {
        dispatch(getMultisigProposals(walletId, { mtx: true }));
      }
    } else {
      info = await wallet.getInfo(walletId);
      accounts = await wallet.getAccounts(walletId);
    }

    // reset tabs in send/receive view
    // so that different instances of the
    // same view start at the first tab
    if (options.resetSendTab) {
      dispatch(selectTab('sendReceive', 0));
    }

    dispatch(setAccounts(walletId, accounts, type));
    dispatch(setWalletInfo(walletId, info, type));

    // get info for each account
    // TODO: test with many accounts
    // TODO: does this take into account
    // multisig vs standard?
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

    const services = selectCurrentClientServices(state);

    // TODO: there is a race condition in which
    // services can be undefined before it is populated
    // by the back end
    if (!services) return;

    // fetch info for each standard wallet
    // then fetch info for each multisig wallet
    // but only if the service is available
    if (services.wallet) {
      const promises = wallets.map(wid => wallet.getInfo(wid));
      const results = await Promise.all(promises);
      for (let i = 0; i < promises.length; i++)
        dispatch(setWalletInfo(wallets[i], results[i]));
    }
    if (services.multisig) {
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
    if (type === 'multisig') {
      info = await client.multisig.createWallet(walletId, options);
      // parse response for secret info
      const cosignerInfo = info.cosigners.find(c => c.token) || {};
      dispatch(
        setTemporarySecrets(walletId, {
          token: cosignerInfo.token,
          path: cosignerInfo.path,
          joinKey: info.joinKey,
          cosignerId: options.cosignerName,
        })
      );
    } else {
      info = await client.wallet.createWallet(walletId, options);
    }
    dispatch(setWalletInfo(walletId, info, type));
  };
}

function getxpubCreateWatchOnlyWallet(walletId, options) {
  return async function action(dispatch) {
    const { xpub } = await getxpub({
      path: options.path,
      chain: options.chain,
      network: options.network,
      account: options.account,
      hardwareType: options.hardwareType,
    });

    assert(walletId, 'must pass wallet id');

    dispatch(
      createWallet(walletId, {
        watchOnly: true,
        accountKey: xpub,
      })
    );
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
    // TODO: docstring doesnt match actual options
    const opts = { paths: true, scripts: true, tx: true, coin: true };
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
    const opts = { paths: true, scripts: true, tx: true, coin: true };
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

    assert(account >= 0, 'account must be greater than or equal to 0');

    const { xpub, path } = await getxpub({
      chain,
      network,
      account,
      hardwareType,
    });

    const response = await multisig.joinWallet(walletId, {
      walletName: walletId,
      cosignerName: cosignerId,
      cosignerPath: path,
      joinKey: joinKey,
      xpub: xpub,
    });

    dispatch(getWalletInfo(walletId, 'multisig'));

    // find the cosigner with the token
    // this should never hit the or case
    const cosignerInfo = response.cosigners.find(c => c.token) || {};
    dispatch(
      setTemporarySecrets(walletId, {
        token: cosignerInfo.token,
        path: cosignerInfo.path,
        joinKey: response.joinKey, // response joinKey is null if
        cosignerId, // wallet is fully joined
      })
    );
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
  return async (dispatch, getState) => {
    const { wallet } = getClient();
    const { passphrase, address, accountId } = options;
    let { rate, value } = options;

    if (typeof rate === 'string') rate = parseInt(rate, 10);
    if (typeof value === 'string') value = parseInt(value, 10);

    assert(rate, 'must enter rate');
    assert(value, 'must enter value');
    assert(address, 'must enter recipient address');
    assert(accountId, 'must enter account id for coin selection');

    // make sure to pass account id
    // so that coins are selected from proper
    // account
    let opts = {
      passphrase,
      rate,
      outputs: [{ value, address }],
      account: accountId,
    };

    try {
      // hardware wallet support
      // create transaction on back end
      // sign it using the hardware
      if (options.hardware) {
        const state = getState();
        const chain = selectCurrentChain(state);
        const network = selectNetwork(state);

        const { xpub } = options;
        assert(xpub, 'must pass xpub to derive path');

        const hdpubkey = toHDPublicKey({
          type: 'base58',
          network,
          chain,
          xpubkey: xpub,
        });

        // remove hardened because templateBIP44Account
        // does it for you
        const accountIndex = hdpubkey.childIndex ^ HARDENED_INDEX;
        // bip44 path up to the account
        const path = templateBIP44Account(chain, network, accountIndex);

        const { node } = getClient();

        // dont sign on back end
        opts.sign = false;
        const tx = await wallet.createTX(walletId, opts);

        const paths = [];
        const coins = [];
        // iterate over tx inputs, building path
        for (const input of tx.inputs) {
          const info = await wallet.getKey(walletId, input.coin.address);
          paths.push(`${path}/${info.branch}/${info.index}`);

          // fetch raw tx
          const inputTX = await wallet.getTX(walletId, input.prevout.hash);
          if (!inputTX) throw new Error('unable to fetch input');

          const coin = toTX(
            { hex: inputTX.tx },
            {
              type: 'raw',
              chain,
            }
          );
          coins.push(coin);
        }

        const transaction = await signTransaction(tx, coins, paths, {
          enc: 'hex',
          chain,
          hardwareType: 'ledger',
        });

        // this will not throw an error on an invalid transaction
        const response = await node.execute('sendrawtransaction', [
          transaction,
        ]);

        const txid = response;
        dispatch(setSendTXSuccess(walletId, accountId, txid, response));
      } else {
        // sign on the back end
        const response = await wallet.send(walletId, opts);
        const txid = response.hash;
        dispatch(setSendTXSuccess(walletId, accountId, txid, response));
      }
    } catch (e) {
      dispatch(
        setSendTXFailure(walletId, accountId, {
          message: e.message,
          rate: opts.rate,
          outputs: opts.outputs,
        })
      );

      console.log(e);

      // propagate error message to front end
      throw e;
    }
  };
}

function getMultisigProposals(walletId, options = {}) {
  return async dispatch => {
    const { multisig } = getClient();
    const proposals = await multisig.getProposals(walletId, true);

    if (options.mtx) {
      for (const proposal of proposals)
        dispatch(getProposalMTX(walletId, proposal.name));
    }
    dispatch(setMultisigProposals(walletId, proposals));
  };
}

async function createProposal(walletId, proposalId, options) {
  return async dispatch => {
    const { multisig } = getClient();

    const { recipient, cosignerToken } = options;
    let { rate, value } = options;
    if (typeof rate === 'string') rate = parseInt(rate, 10);
    if (typeof value === 'string') value = parseInt(value, 10);

    assert(rate, 'must pass a rate');
    assert(value, 'must pass a value');
    assert(recipient, 'must pass a recipient');
    assert(cosignerToken, 'must pass cosigner token');

    // must have wallet no-auth set to false
    // for this to work
    await multisig.createProposal(walletId, proposalId, {
      rate,
      outputs: [{ value, address: recipient }],
      token: cosignerToken,
    });

    // refresh proposals list
    dispatch(getMultisigProposals(walletId));
  };
}

/**
 * broadcast a raw transaction
 * @param {Object}  - options
 * @param {String}  - options.transaction
 * @param {Boolean} - options.fetchProposal
 * @param {String}  - options.walletId
 * @param {String}  - options.accountId
 * @dispatches
 * @returns {void}
 */
async function broadcastTransaction(options) {
  return async dispatch => {
    const { walletId, proposalId, accountId } = options;
    let rawtx = options.transaction;

    // multisig proposal needs to be fetched
    // from bmultisig
    if (options.fetchProposal) {
      // fetch tx from backend
      const { multisig } = getClient();

      const mtx = await multisig.getProposalMTX(walletId, proposalId, {
        paths: true,
        scripts: true,
        tx: true,
        coin: true,
      });
      // overwrite raw tx with fetched transaction
      rawtx = mtx.tx.hex;
    }

    const { node } = getClient();
    try {
      const response = await node.execute('sendrawtransaction', [rawtx]);
      dispatch(setSendTXSuccess(walletId, accountId, response, {}));
    } catch (e) {
      dispatch(
        setSendTXFailure(walletId, accountId, {
          message: e.message,
        })
      );
    }
  };
}

// must sign as part of approval
function approveProposal(walletId, proposalId, options) {
  return async (dispatch, getState) => {
    const state = getState();
    const chain = selectCurrentChain(state);
    const network = selectNetwork(state);

    const { hardwareType, cosignerToken, account } = options;

    const { multisig } = getClient();
    const client = multisig.wallet(walletId, cosignerToken);

    const proposalTX = await client.getProposalMTX(proposalId, {
      paths: true,
      scripts: true,
      coin: true,
      tx: true,
    });

    // get signature
    const signatures = await getHardwareSignatures({
      hardwareType,
      proposalTX,
      account,
      chain,
      network,
    });

    // submit signature
    await client.approveProposal(proposalId, signatures);

    // refresh wallet info
    dispatch(getWalletInfo(walletId, 'multisig'));
  };
}

function rejectProposal(walletId, proposalId, cosignerToken) {
  return async dispatch => {
    const { multisig } = getClient();

    const client = multisig.wallet(walletId, cosignerToken);
    await client.rejectProposal(proposalId);

    // refresh wallet info
    dispatch(getWalletInfo(walletId, 'multisig'));
  };
}

function setTemporarySecrets(walletId, options) {
  const { type = 'set', joinKey, token, cosignerId } = options;

  let action;
  if (type === 'set') action = SET_TEMPORARY_SECRETS;
  else if (type === 'clear') action = CLEAR_TEMPORARY_SECRETS;

  return {
    type: action,
    payload: {
      walletId,
      joinKey,
      token,
      cosignerId,
    },
  };
}

module.exports = {
  clearAllWallets,
  getWallets,
  getWalletInfo,
  getxpubCreateMultisigWallet,
  getxpubCreateWatchOnlyWallet,
  broadcastTransaction,
  getWalletsInfo,
  getMultisigProposals,
  selectWallet,
  joinWallet,
  createWallet,
  selectProposal,
  getProposalMTX,
  createProposal,
  sendTX,
  setTemporarySecrets,
  approveProposal,
  rejectProposal,
  resetApp,
};
