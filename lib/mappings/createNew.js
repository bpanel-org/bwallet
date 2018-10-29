import assert from 'bsert';
import { selectWallets } from './selectors';
import { createWallet, createAccount } from '../actions';
import { getxpub } from '../utilities';

/*
 * getxpub then create account using the xpub
 */

async function createHardwareWatchOnlyAccount(walletId, accountId, options) {
  const { xpub } = await getxpub({
    chain: options.chain,
    network: options.network,
    account: options.account,
    hardwareType: options.hardwareType,
  });

  assert(walletId, 'must pass wallet id');
  assert(accountId, 'must pass account id');

  return createAccount(walletId, accountId, {
    watchOnly: true,
    xpub,
  });
}

function mapStateToProps(state, otherProps) {
  return {
    wallets: selectWallets(state),
    ...otherProps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createWallet: (walletId, options, type) =>
      dispatch(createWallet(walletId, options, type)),
    createHardwareWatchOnlyAccount: (walletId, accountId, options) =>
      dispatch(createHardwareWatchOnlyAccount(walletId, accountId, options)),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
