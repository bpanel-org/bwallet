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
      'Watch Only': `${wallet.watchOnly}`,
      'Multi-Party': 'false',
    });
  }
  for (const msWallet of Object.values(multisigWallets)) {
    // balance is null for non initialized
    // multisignature wallets
    let balance = msWallet.balance;
    if (balance) balance = balance.confirmed;
    else balance = 0;

    walletsList.push({
      Name: msWallet.id || '',
      Balance: balance,
      'Watch Only': 'false',
      'Multi-Party': 'true',
    });
  }

  walletsList.sort((a, b) => a.Name.toLowerCase() < b.Name.toLowerCase());
  return walletsList;
}

/*
 * NOTE: must be multisig wallet info that has cosigners array
 */
function buildPendingMSList(info) {
  const wallets = [];
  const pending = Object.values(info).filter(i => i.n > i.cosigners.length);
  for (const wallet of pending) {
    wallets.push({
      Name: wallet.id,
      'M of N': `${wallet.m} of ${wallet.n}`,
      Progress: `${wallet.cosigners.length}/${wallet.n}`,
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
