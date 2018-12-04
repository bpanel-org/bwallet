import {
  selectWallets,
  selectCurrentChain,
  selectNetwork,
  selectCurrentClientServices,
} from './selectors';
import {
  createWallet,
  getxpubCreateWatchOnly,
  getxpubCreateMultisigWallet,
  getxpubCreateWatchOnlyWallet,
} from '../actions';

function mapStateToProps(state, otherProps) {
  return {
    wallets: selectWallets(state),
    chain: selectCurrentChain(state),
    network: selectNetwork(state),
    services: selectCurrentClientServices(state),
    ...otherProps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createWallet: (walletId, options, type) =>
      dispatch(createWallet(walletId, options, type)),
    getxpubCreateWatchOnly: async (walletId, accountId, options) =>
      dispatch(await getxpubCreateWatchOnly(walletId, accountId, options)),
    getxpubCreateMultisigWallet: async (walletId, options) =>
      dispatch(await getxpubCreateMultisigWallet(walletId, options)),
    getxpubCreateWatchOnlyWallet: async (walletId, options) => dispatch(getxpubCreateWatchOnlyWallet(walletId, options)),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
