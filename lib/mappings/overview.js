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
      Name: wallet.id || '',
      Balance: wallet.balance.confirmed,
      'Watch Only': wallet.watchOnly,
      Multisig: false,
    });
  }
  for (const msWallet of Object.values(multisigWallets)) {
    walletsList.push({
      Name: msWallet.id || '',
      Balance: msWallet.balance.confirmed,
      'Watch Only': msWallet.watchOnly,
      Multisig: true,
    });
  }

  walletsList.sort((a, b) => a.Name.toLowerCase() < b.Name.toLowerCase());
  return walletsList;
}

// TODO: iterate over all multisig, filter for pending: true, shape for table
function buildPendingMSList(multisigWallets) {
  const wallets = [];
  for (const wallet of Object.values(multisigWallets)) {
    if (wallet.pending)
      wallets.push({
        name: wallet.id || '',
      });
  }
  return wallets;
}

function mapStateToProps(state, otherProps) {
  const wallets = selectWallets(state);
  const multisigWallets = selectMultisigWallets(state);
  const walletInfo = selectWalletInfo(state);
  const multisigWalletInfo = selectMultisigWalletInfo(state);

  const walletsList = buildWalletsList(walletInfo, multisigWalletInfo);
  const pendingMultiparty = buildPendingMSList(multisigWalletInfo);

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
    getWallets: type => dispatch(getWallets(type)),
    getWalletInfo: (walletId, type) => dispatch(getWalletInfo(walletId, type)),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
