import {
  selectWallets,
  selectMultisigWallets,
  selectWalletAccounts,
  selectSelectedWallet,
  selectSelectedAccount,
} from './selectors';

import { selectWallet, getWallets, selectAccount } from '../actions';

function mapStateToProps(state, otherProps) {
  const wallets = selectWallets(state);
  const multisigWallets = selectMultisigWallets(state);
  const selectedWallet = selectSelectedWallet(state);
  const selectedAccount = selectSelectedAccount(state);
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
    ...otherProps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getWallets: type => dispatch(getWallets(type)),
    selectWallet: (walletId, type) => dispatch(selectWallet(walletId, type)),
    selectAccount: (walletId, accountId) =>
      dispatch(selectAccount(walletId, accountId)),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
