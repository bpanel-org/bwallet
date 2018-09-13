const assert = require('bsert');
const { getClient } = require('@bpanel/bpanel-utils');
const HardwareWallet = require('./hardwareWallet');

const {
  SET_SIGNING_STATUS,
  USER_SELECT_WALLET_TYPE,
} = require('../constants');

const {
  createSignature,
  renderxpubAccount,
} = require('../utilities');

function setSigningStatus(walletId, proposalId, cosignerId, status) {
  assert(status === 'start' || status === 'complete' || status === 'failure');
  return {
    type: SET_SIGNING_STATUS,
    payload: { status, proposalId, walletId, cosignerId },
  }
}

function setWalletType(type) {
  return {
    type: USER_SELECT_WALLET_TYPE,
    payload: { walletType: type },
  }
}

/*
 * TODO: add trezor
 */
function selectWalletType(type) {
  assert(type === 'ledger');
  return dispatch => {
    dispatch(setWalletType(type));
  }
}

/*
 * TODO: fetch account from cosignerId?
 */
function signTx(walletId, proposalId, cosignerId) {
  return async (dispatch, getState) => {
    const state = getState();

    const walletType = state[PLUGIN_NAMESPACE][SELECTED_WALLET_TYPE_NAMESPACE];
    assert(walletType, `must have defined wallet type, found ${walletType}`);
    const network = state.network; // TODO: correct path to network?
    assert(network, `must have defined network, found ${network}`);
    const account = state.account; // TODO: correct path
    assert(account, `must have defined account, found ${account}`);

    const xpubAccount = renderxpubAccount(account, network);

    const { multisig } = getClient();
    const opts = { paths: true, scripts: true };
    const ptx = await multisig.getProposalMTX(walletId, proposalId, opts);
    assert(ptx, 'could not fetch proposal tx');

    dispatch(setSigningStatus(walletId, proposalId, cosignerId, 'start'));
    const harwareWallet = HardwareWallet.fromOptions(walletType);

    const signatures = createSignature(hardwareWallet, ptx, xpubAccount, 'hex');
    harwareWallet.close();

    dispatch(setSigningStatus(walletId, proposalId, cosignerId, 'complete'));
    return signatures;
  }
}

module.exports = {
  signTx,
  selectWalletType,
};

