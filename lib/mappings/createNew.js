import assert from 'bsert';
import { selectWallets, selectCurrentChain, selectNetwork } from './selectors';
import { createWallet, createAccount } from '../actions';
import { getxpub } from '../utilities';

/*
 * getxpub then create account using the xpub
 */

async function createHardwareWatchOnlyAccount(walletId, accountId, options) {
  return async function action(dispatch) {
    const { xpub } = await getxpub({
      chain: options.chain,
      network: options.network,
      account: options.account,
      hardwareType: options.hardwareType,
    });

    assert(walletId, 'must pass wallet id');
    assert(accountId, 'must pass account id');

    dispatch(createAccount(walletId, accountId, {
      watchOnly: true,
      xpub,
    }));
  }
}

function mapStateToProps(state, otherProps) {
  return {
    wallets: selectWallets(state),
    chain: selectCurrentChain(state),
    network: selectNetwork(state),
    ...otherProps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createWallet: (walletId, options, type) =>
      dispatch(createWallet(walletId, options, type)),
    createHardwareWatchOnlyAccount: async (walletId, accountId, options) =>
      dispatch(await createHardwareWatchOnlyAccount(walletId, accountId, options)),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
