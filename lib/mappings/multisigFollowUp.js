import { selectMultisigWalletInfo } from './selectors';

// depends on react-router
function mapStateToProps(state, otherProps) {
  const multisigWalletInfo = selectMultisigWalletInfo(state);
  // TODO: selectselected wallet
  const walletId = otherProps.match.params.wallet;
  let joinKey, id, token, cosigner;
  const info = multisigWalletInfo[walletId];


  // the token will not always reach here
  // move parsing of the token further up the stack
  if (info) {
    joinKey = info.joinKey;
    id = info.id;
    // TODO: hack here using ||
    // find current cosigner
    cosigner = info.cosigners.find(c => c.token) || {};
    token = cosigner.token;
  }

  return {
    joinKey,
    token,
    id,
    ...otherProps,
  };
}

// TODO: create clear ms wallet info action
// to remove sensitive information from the state
function mapDispatchToProps() {
  return {};
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
