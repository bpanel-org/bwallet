import { selectSelectedWallet } from './selectors';
import { selectAccount, selectWallet } from '../actions';

function mapStateToProps(state, otherProps) {
  const selectedWallet = selectSelectedWallet(state);
  return {
    selectedWallet,
    ...otherProps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectAccount: async (walletId, accountId) =>
      dispatch(selectAccount(walletId, accountId)),
    selectWallet: async (walletId, type) =>
      dispatch(selectWallet(walletId, type)),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
