import { bwalletClient, bmultisigClient } from '@bpanel/bpanel-utils';

import {
  SET_WALLET_HISTORY,
  SET_WALLETS,
  SET_WALLET_ACCOUNTS,
  USER_SELECT_WALLET,
  USER_SELECT_ACCOUNT,
  USER_SELECT_MULTISIG_WALLET,
  SET_WALLET_INFO,
  SET_WALLET_ACCOUNT_INFO,
  SET_WALLET_ACCOUNT_BALANCE, //
  WALLET_CREATE_ACCOUNT,
  CREATE_WALLET_RECEIVE_ADDRESS,
  SET_MULTISIG_WALLETS,
  SET_MULTISIG_WALLET_INFO,
  SET_MULTISIG_WALLET_PROPOSALS,
  USER_SELECT_MULTISIG_PROPOSAL,
  SET_MULTISIG_PROPOSAL_MTX,
  USER_SELECT_XPUB,
  UPDATE_TEXT_FIELD,
} from './constants';

const client = bwalletClient();
const multisigClient = bmultisigClient();

// action creators
const setHistory = (walletId, accountId, history) => ({
  type: SET_WALLET_HISTORY,
  payload: { walletId, accountId, history },
});
const setWallets = wallets => ({
  type: SET_WALLETS,
  payload: { wallets },
});
const setAccounts = (walletId, accounts) => ({
  type: SET_WALLET_ACCOUNTS,
  payload: { accounts, walletId },
});
const setSelectWallet = walletId => ({
  type: USER_SELECT_WALLET,
  payload: { walletId },
});
const setSelectAccount = accountId => ({
  type: USER_SELECT_ACCOUNT,
  payload: { accountId },
});
const setWalletInfo = (walletId, walletInfo) => ({
  type: SET_WALLET_INFO,
  payload: { walletInfo, walletId },
});
const setAccountInfo = (walletId, accountId, accountInfo) => ({
  type: SET_WALLET_ACCOUNT_INFO,
  payload: { walletId, accountId, accountInfo },
});
const setAccountBalance = (walletId, accountId, balance) => ({
  type: SET_WALLET_ACCOUNT_BALANCE,
  payload: { walletId, accountId, balance },
});

// NOTE: may need to pass payload in here in the future
const _createReceiveAddress = () => ({
  type: CREATE_WALLET_RECEIVE_ADDRESS,
  payload: {},
});
const _createAccount = (walletId, accountId, accountInfo) => ({
  type: WALLET_CREATE_ACCOUNT,
  payload: { walletId, accountId, accountInfo },
});
// multisig wallet helpers
const setMultisigWallets = multisigWallets => ({
  type: SET_MULTISIG_WALLETS,
  payload: { multisigWallets },
});
const setMultisigWallet = walletId => ({
  type: USER_SELECT_MULTISIG_WALLET,
  payload: { walletId },
});
const setMultisigWalletInfo = (walletId, multisigWalletInfo) => ({
  type: SET_MULTISIG_WALLET_INFO,
  payload: { walletId, multisigWalletInfo },
});
const setMultisigProposals = (walletId, proposals) => ({
  type: SET_MULTISIG_WALLET_PROPOSALS,
  payload: { walletId, proposals },
});
const setMultisigProposalMTX = (walletId, proposalId, mtx) => ({
  type: SET_MULTISIG_PROPOSAL_MTX,
  payload: { walletId, proposalId, mtx },
});

export const selectXPUB = xpub => {
  return {
    type: USER_SELECT_XPUB,
    payload: { selectedXPUB: xpub },
  };
};

export const selectMultisigProposal = proposalId => {
  return {
    type: USER_SELECT_MULTISIG_PROPOSAL,
    payload: { proposalId },
  };
};

export const getMultisigWallets = () => async dispatch => {
  const wallets = await multisigClient.getWallets();
  dispatch(setMultisigWallets(wallets));
};

export const getMultisigWalletProposals = walletId => async dispatch => {
  const proposals = await multisigClient.getProposals(walletId, true);
  dispatch(setMultisigProposals(walletId, proposals));
};
export const getMultisigWalletProposalMTX = (
  walletId,
  proposalId
) => async dispatch => {
  const mtx = await multisigClient.getProposalMTX(walletId, proposalId, {
    paths: true,
    scripts: true,
  });
  dispatch(setMultisigProposalMTX(walletId, proposalId, mtx));
};

export const selectMultisigWallet = walletId => async dispatch => {
  const info = await multisigClient.getInfo(walletId, true);
  dispatch(setMultisigWalletInfo(walletId, info));
  // setMultisigWallet must come second
  dispatch(setMultisigWallet(walletId));
};

export const getHistory = (walletId, accountId) => async dispatch => {
  // TODO: figure out pagination
  const history = await client.getHistory(walletId, accountId);
  dispatch(setHistory(walletId, accountId, history));
};

export const getWallets = () => async dispatch => {
  // list of strings, the wallet name
  const wallets = await client.getWallets();
  dispatch(setWallets(wallets));
};

export const getAccounts = walletId => async dispatch => {
  // list of strings, the account names
  const accounts = await client.getAccounts(walletId);
  dispatch(setAccounts(walletId, accounts));
};

export const getAccountInfo = (walletId, accountId) => async dispatch => {
  const accountInfo = await client.getAccount(walletId, accountId);
  dispatch(setAccountInfo(walletId, accountId, accountInfo));
};

export const getAccountBalance = (walletId, accountId) => async dispatch => {
  const balance = await client.getBalance(walletId, accountId);
  dispatch(setAccountBalance(walletId, accountId, balance));
};

export const createWallet = (walletId, options) => async dispatch => {
  const walletInfo = await client.createWallet(walletId, options);
  dispatch(setWalletInfo(walletId, walletInfo));
};

export const createAccount = (
  walletId,
  accountId,
  options = {}
) => async dispatch => {
  const accountInfo = await client.createAccount(walletId, accountId, options);
  dispatch(_createAccount(walletId, accountId, accountInfo));
};

export const selectWallet = walletId => async dispatch => {
  dispatch(setSelectWallet(walletId));
  const walletInfo = await client.getInfo(walletId);
  dispatch(setWalletInfo(walletId, walletInfo));
};

export const selectAccount = accountId => dispatch => {
  dispatch(setSelectAccount(accountId));
};

export const createReceiveAddress = (walletId, accountId) => async dispatch => {
  await client.createAddress(walletId, accountId);
  dispatch(_createReceiveAddress());
};

export const updateTextField = (field, value, valid) => {
  return {
    type: UPDATE_TEXT_FIELD,
    payload: { field, value, valid },
  };
};

