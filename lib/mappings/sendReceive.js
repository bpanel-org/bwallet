import {
  selectWallets,
  selectWalletAccounts,
  selectSelectedWallet,
  selectSelectedAccount,
} from './selectors';

import { selectWallet, getWallets, selectAccount } from '../actions';

function mapStateToProps(state, otherProps) {
  const wallets = selectWallets(state);
  const selectedWallet = selectSelectedWallet(state);
  const selectedAccount = selectSelectedAccount(state);
  let accounts = selectWalletAccounts(state, selectedWallet);

  if (!accounts) accounts = [];

  return {
    wallets,
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
