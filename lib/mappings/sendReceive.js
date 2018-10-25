import {
  selectWallets,
  selectMultisigWallets,
  selectWalletAccounts,
  selectSelectedWallet,
  selectSelectedAccount,
  selectWalletInfo,
} from './selectors';

import {
  selectWallet,
  getWallets,
  selectAccount,
  joinWallet,
  sendTX,
  createAddress,
} from '../actions';

function mapStateToProps(state, otherProps) {
  const wallets = selectWallets(state);
  const multisigWallets = selectMultisigWallets(state);
  const selectedWallet = selectSelectedWallet(state);
  const selectedAccount = selectSelectedAccount(state);

  /*
  // TODO: handle multisig or standard
  const walletInfo = selectWalletInfo(state);
  const selectedWalletInfo = walletInfo[selectedWallet];
  */

  const receiveAddress = '';

  let accounts = selectWalletAccounts(state, selectedWallet);

  if (!accounts) accounts = [];

  const allWallets = [];
  for (let w of wallets) allWallets.push({ value: 'standard', label: w });
  for (let msw of multisigWallets)
    allWallets.push({ value: 'multisig', label: msw });

  return {
    wallets,
    multisigWallets,
    allWallets,
    accounts,
    selectedWallet,
    selectedAccount,
    receiveAddress,
    ...otherProps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getWallets: type => dispatch(getWallets(type)),
    selectWallet: (walletId, type) => dispatch(selectWallet(walletId, type)),
    selectAccount: (walletId, accountId) =>
      dispatch(selectAccount(walletId, accountId)),
    joinWallet: options => dispatch(joinWallet(options)),
    sendTX: (walletId, options) => dispatch(sendTX(walletId, options)),
    createAddress: (walletId, accountId, options) =>
      dispatch(createAddress(walletId, accountId, options)),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
