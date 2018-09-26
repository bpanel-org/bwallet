import { createWallet } from '../actions';
import { selectCurrentChain, selectNetwork } from '../mappings/selectors';

function mapStateToProps(state, otherProps) {
  return {
    currentChain: selectCurrentChain(state),
    network: selectNetwork(state),
    ...otherProps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createWallet: (walletId, options, type) =>
      dispatch(createWallet(walletId, options, type)),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
