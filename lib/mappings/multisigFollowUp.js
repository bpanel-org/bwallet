import { selectMultisigWalletInfo, selectedMultisigWallet } from './selectors';

// depends on react-router
function mapStateToProps(state, otherProps) {
  const multisigWalletInfo = selectMultisigWalletInfo(state);
  const walletId = otherProps.match.params.wallet;
  let joinKey, id, token, cosigner;
  const info = multisigWalletInfo[walletId];

  if (info) {
    joinKey = info.joinKey;
    id = info.id;
    // find current cosigner
    cosigner = info.cosigners.find(c => c.token);
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
function mapDispatchToProps(dispatch) {
  return {};
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};

