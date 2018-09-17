import {
  selectWallets,
  selectWalletAccounts,
  selectSelectedWallet,
} from './selectors';

function mapStateToProps(state, otherProps) {
  const wallets = selectWallets(state);
  const selectedWallet = selectSelectedWallet(state);
  let accounts = selectWalletAccounts(state, selectedWallet);

  if (accounts) accounts = [];

  return {
    wallets,
    accounts,
    ...otherProps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    undefined: async () => dispatch(),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
