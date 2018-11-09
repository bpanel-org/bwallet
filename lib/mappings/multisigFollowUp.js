import { setTemporarySecrets } from '../actions';
import { selectSelectedWallet, selectMultisigWalletInfo, selectTemporarySecrets } from './selectors';

// depends on react-router
function mapStateToProps(state, otherProps) {

  const walletId = otherProps.match.params.wallet;
  const action = otherProps.match.params.action;
  const multisigWalletInfo = selectMultisigWalletInfo(state, walletId) || {};

  const secrets = selectTemporarySecrets(state, walletId) || {};
  const joinKey = secrets.joinKey;
  const cosignerId = secrets.cosignerId;
  const token = secrets.token;
  const path = secrets.path;

  return {
    joinKey,
    token,
    cosignerId,
    walletId,
    path,
    action,
    m: multisigWalletInfo.m,
    n: multisigWalletInfo.n,
    initialized: multisigWalletInfo.initialized,
    cosigners: multisigWalletInfo.cosigners,
    ...otherProps,
  };
}

// TODO: create clear ms wallet info action
// to remove sensitive information from the state
function mapDispatchToProps() {
  return {
    setTemporarySecrets: (walletId, options) =>
      setTemporarySecrets(walletId, options),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
