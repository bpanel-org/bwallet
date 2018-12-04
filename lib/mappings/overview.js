import {
  getWallets,
  getWalletInfo,
  getAccountHistory,
  selectWallet,
  selectAccount,
} from '../actions';
import assert from 'bsert';
import { Currency } from '@bpanel/bpanel-utils';

import {
  selectWallets,
  selectMultisigWallets,
  selectWalletInfo,
  selectMultisigWalletInfo,
  selectHistory,
  selectCurrentChain,
} from './selectors';

function buildWalletsList(wallets, multisigWallets, chain) {
  assert(wallets, 'must provide wallets object');
  assert(multisigWallets, 'must provide multisigwallets object');

  // TODO: this needs to be refactored
  const walletsList = [];
  for (const wallet of Object.values(wallets)) {
    const balance = wallet.balance ? wallet.balance.confirmed : 0;
    const currency = new Currency(chain, balance).withLabel('unit');
    walletsList.push({
      name: wallet.id || '',
      balance: currency,
      watchOnly: wallet.watchOnly,
      multisig: false,
      icon: 'fa-user',
      text: wallet.watchOnly ? `Watch Only - ${balance}` : balance,
      type: 'standard',
    });
  }
  for (const msWallet of Object.values(multisigWallets)) {
    const balance = msWallet.balance ? msWallet.balance.confirmed : 0;
    const currency = new Currency(chain, balance).withLabel('unit');
    walletsList.push({
      name: msWallet.id || '',
      balance: currency,
      watchOnly: true,
      multisig: true,
      icon: 'fa-users',
      text: `Multisig - ${balance}`,
      type: 'multisig',
    });
  }

  // sort descending order
  walletsList.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase());
  return walletsList;
}

// TODO: iterate over all multisig, filter for pending: true, shape for table
function buildPendingMSList(multisigWallets) {
  const wallets = [];
  for (const wallet of Object.values(multisigWallets)) {
    if (wallet.initialized === false)
      wallets.push({
        Name: wallet.id || '',
        Date: '', // can implement with new version of bmultisig
        'M of N': `${wallet.m} of ${wallet.n}`,
        Init: `${wallet.initialized}`,
        Join: '',
      });
  }
  return wallets;
}

function mapStateToProps(state, otherProps) {
  const wallets = selectWallets(state);
  const multisigWallets = selectMultisigWallets(state);
  const walletInfo = selectWalletInfo(state);
  const multisigWalletInfo = selectMultisigWalletInfo(state);
  const chain = selectCurrentChain(state);

  const walletsList = buildWalletsList(walletInfo, multisigWalletInfo, chain);
  const pendingMultiparty = buildPendingMSList(multisigWalletInfo);
  const history = selectHistory(state);

  // TODO: come up with better strategy for rendering transactions
  // for now render the first 10 transactions for each wallet's
  // default account
  const recentTransactions = [];
  for (const [key, w] of Object.entries(history)) {
    if (w.default)
      recentTransactions.push(
        ...w.default.slice(0, 10).map(tx => {
          tx.wallet = key;
          return tx;
        })
      );
  }

  return {
    wallets,
    multisigWallets,
    walletInfo,
    multisigWalletInfo,
    walletsList,
    pendingMultiparty,
    recentTransactions,
    ...otherProps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getWallets: type => dispatch(getWallets(type)),
    getWalletInfo: (walletId, type) => dispatch(getWalletInfo(walletId, type)),
    getAccountHistory: (walletId, accountId) =>
      dispatch(getAccountHistory(walletId, accountId)),
    selectWallet: (walletId, type, options) =>
      dispatch(selectWallet(walletId, type, options)),
    selectAccount: (walletId, accountId) =>
      dispatch(selectAccount(walletId, accountId)),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
