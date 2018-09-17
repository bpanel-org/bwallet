import { getWallets, getWalletInfo } from '../actions';
import assert from 'bsert';

import {
  selectWallets,
  selectMultisigWallets,
  selectWalletInfo,
  selectMultisigWalletInfo,
} from './selectors';

// TODO: append proper network symbol to balance based on chain
function buildWalletsList(wallets, multisigWallets) {
  assert(wallets, 'must provide wallets object');
  assert(multisigWallets, 'must provide multisigwallets object');

  const walletsList = [];
  for (const wallet of Object.values(wallets)) {
    walletsList.push({
      Name: wallet.id,
      Balance: wallet.balance.confirmed,
      'Watch Only': wallet.watchOnly,
      Multisig: false,
    });
  }

  for (const msWallet of Object.values(multisigWallets)) {
    walletsList.push({
      Name: msWallet.id,
      Balance: msWallet.balance.confirmed,
      'Watch Only': msWallet.watchOnly,
      Multisig: true,
    });
  }

  // toLowercase()
  walletsList.sort((a, b) => a.name < b.name);

  return walletsList;
}

// TODO: iterate over all multisig, filter for pending: true, shape for table
function buildPendingMSList() {
  return [];
}

function mapStateToProps(state, otherProps) {
  const wallets = selectWallets(state);
  const multisigWallets = selectMultisigWallets(state);
  const walletInfo = selectWalletInfo(state);
  const multisigWalletInfo = selectMultisigWalletInfo(state);

  const walletsList = buildWalletsList(walletInfo, multisigWalletInfo);

  const pendingMultiparty = buildPendingMSList();
  return {
    wallets,
    multisigWallets,
    walletInfo,
    multisigWalletInfo,
    walletsList,
    pendingMultiparty,
    ...otherProps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getWallets: async type => dispatch(getWallets(type)),
    getWalletInfo: async (walletId, type) =>
      dispatch(getWalletInfo(walletId, type)),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
