import {
  selectWallets,
  selectWalletAccounts,
  selectSelectedWallet,
} from './selectors';

import { getWallets } from '../actions';

function mapStateToProps(state, otherProps) {
  const wallets = selectWallets(state);
  const selectedWallet = selectSelectedWallet(state);
  let accounts = selectWalletAccounts(state, selectedWallet);

  if (!accounts)
    accounts = [];

  return {
    wallets,
    accounts,
    ...otherProps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getWallets: async type => dispatch(getWallets(type)),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
