import { createWallet } from '../actions';

function mapStateToProps(state, otherProps) {
  return {
    ...otherProps
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
