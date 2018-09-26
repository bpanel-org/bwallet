import { createWallet } from '../actions';
import { selectCurrentChain } from '../mappings/selectors';

function mapStateToProps(state, otherProps) {
  const currentChain = selectCurrentChain(state);
  return {
    currentChain,
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
