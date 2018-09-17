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

function selectAppNamespace(state, key) {
  const namespace = state[PLUGINS][PLUGIN_NAMESPACE];
  if (key)
    return namespace[key];
  return namespace;
}

function selectWalletsNamespace(state, key) {
  const namespace = selectAppNamespace(state, REDUCE_WALLETS_NAMESPACE);
  if (key) return namespace[key];
  return namespace;
}

export function selectWallets(state) {
  return selectWalletsNamespace(state, WALLETS_NAMESPACE);
}

export function selectMultisigWallets(state) {
  return selectWalletsNamespace(state, MULTISIG_WALLETS_NAMESPACE);
}

export function selectWalletInfo(state) {
  return selectWalletsNamespace(state, WALLET_INFO_NAMESPACE);
}

export function selectMultisigWalletInfo(state) {
  return selectWalletsNamespace(state, MULTISIG_WALLET_INFO_NAMESPACE);
}

