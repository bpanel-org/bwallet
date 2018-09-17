import { getWallets, getWalletInfo } from '../actions'
import assert from 'bsert';

import {
  PLUGIN_NAMESPACE,
  WALLETS_NAMESPACES,
  PLUGINS,
  REDUCE_WALLETS_NAMESPACE,
} from '../constants';

const {
  WALLETS_NAMESPACE,
  MULTISIG_WALLETS_NAMESPACE,
  WALLET_INFO_NAMESPACE,
  MULTISIG_WALLET_INFO_NAMESPACE,
} = WALLETS_NAMESPACES;

function selectAppNamespace(state) {
  return state[PLUGINS][PLUGIN_NAMESPACE];
}
function selectWalletsNamespace(state, key) {
  const namespace = selectAppNamespace(state)[REDUCE_WALLETS_NAMESPACE];
  if (key)
    return namespace[key];
  return namespace;
}
function selectWallets(state) {
  return selectWalletsNamespace(state, WALLETS_NAMESPACE);
}
function selectMultisigWallets(state) {
  return selectWalletsNamespace(state, MULTISIG_WALLETS_NAMESPACE);
}
function selectWalletInfo(state) {
  return selectWalletsNamespace(state, WALLET_INFO_NAMESPACE);
}
function selectMultisigWalletInfo(state) {
  return selectWalletsNamespace(state, MULTISIG_WALLET_INFO_NAMESPACE);
}

// TODO: append proper network symbol to balance
// based on chain
function buildWalletsList(wallets, multisigWallets) {
  const walletsList = [];
  for (const wallet of Object.values(wallets)) {
    walletsList.push({
      Name: wallet.id,
      Balance: wallet.balance.confirmed,
      'Watch Only': wallet.watchOnly,
      Multisig: false,
    });
  }

  for (const msWallet of Object.values(multisigWallets)) {
    walletsList.push({
      Name: wallet.id,
      Balance: wallet.balance.confirmed,
      'Watch Only': wallet.watchOnly,
      Multisig: true,
    })
  }

  // toLowercase()
  walletsList.sort((a,b) => a.name < b.name);

  return walletsList;
}

function mapStateToProps(state, otherProps) {
  const wallets = selectWallets(state);
  const multisigWallets = selectMultisigWallets(state);
  const walletInfo = selectWalletInfo(state);
  const multisigWalletInfo = selectMultisigWalletInfo(state);

  const walletsList = buildWalletsList(walletInfo, multisigWalletInfo);

  // TODO: iterate over all multisig, filter for pending: true, shape for table
  const pendingMultiparty = [];
  return {
    wallets,
    multisigWallets,
    walletInfo,
    multisigWalletInfo,
    walletsList,
    pendingMultiparty,
    ...otherProps
  };
};

function mapDispatchToProps(dispatch) {
  return {
    getWallets: async (type) => dispatch(getWallets(type)),
    getWalletInfo: async (walletId, type) => dispatch(getWalletInfo(walletId, type)),
  };
};

export default {
  mapStateToProps,
  mapDispatchToProps,
}

