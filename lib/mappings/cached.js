import {
  defaultMemoize,
  createSelector,
  createSelectorCreator,
} from 'reselect';

import { isEqual } from 'lodash';

import { selectWalletInfo, selectMultisigWalletInfo } from './selectors';

const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

const getWalletsList = createSelector(
  [selectWalletInfo, selectMultisigWalletInfo],
  function getWalletsListCB(wallets, multisigWallets) {
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
    walletsList.sort((a, b) => a.name < b.name);
    return walletsList;
  }
);

module.exports = {
  getWalletsList,
  createDeepEqualSelector,
};
