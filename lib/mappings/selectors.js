import {
  PLUGIN_NAMESPACE,
  WALLETS_NAMESPACES,
  APP_NAMESPACES,
  PLUGINS,
  REDUCE_WALLETS_NAMESPACE,
  REDUCE_APP_NAMESPACE,
} from '../constants';

const {
  WALLETS_NAMESPACE,
  MULTISIG_WALLETS_NAMESPACE,
  WALLET_INFO_NAMESPACE,
  MULTISIG_WALLET_INFO_NAMESPACE,
  ACCOUNTS_NAMESPACE,
  ACCOUNT_INFO_NAMESPACE,
  HISTORY_NAMESPACE,
  MULTISIG_ACCOUNTS_NAMESPACE,
  TEMPORARY_SECRETS_NAMESPACE,
} = WALLETS_NAMESPACES;

const {
  SELECTED_WALLET_NAMESPACE,
  SELECTED_ACCOUNT_NAMESPACE,
  SELECTED_PROPOSAL_NAMESPACE,
  SELECTED_WALLET_TYPE_NAMESPACE,
} = APP_NAMESPACES;

function selectAppNamespace(state, key) {
  const namespace = state[PLUGINS][PLUGIN_NAMESPACE];
  if (key) return namespace[key];
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

// used with 1 or 2 params in codebase
export function selectMultisigWalletInfo(state, wallet) {
  const namespace = selectWalletsNamespace(
    state,
    MULTISIG_WALLET_INFO_NAMESPACE
  );
  if (wallet) return namespace[wallet];
  return namespace;
}

export function selectWalletAccounts(state, wallet) {
  const namespace = selectWalletsNamespace(state, ACCOUNTS_NAMESPACE);
  return namespace[wallet];
}

export function selectMultisigWalletAccounts(state, wallet) {
  const namespace = selectWalletsNamespace(state, MULTISIG_ACCOUNTS_NAMESPACE);
  return namespace[wallet];
}

export function selectTemporarySecrets(state, key) {
  const namespace = selectWalletsNamespace(state, TEMPORARY_SECRETS_NAMESPACE);
  if (key) return namespace[key];
  return namespace;
}

function selectSelected(state, key) {
  const namespace = selectAppNamespace(state, REDUCE_APP_NAMESPACE);
  if (key) return namespace[key];
  return namespace;
}

export function selectSelectedWallet(state) {
  return selectSelected(state, SELECTED_WALLET_NAMESPACE);
}
export function selectSelectedAccount(state) {
  return selectSelected(state, SELECTED_ACCOUNT_NAMESPACE);
}
export function selectSelectedProposal(state) {
  return selectSelected(state, SELECTED_PROPOSAL_NAMESPACE);
}
export function selectSelectedWalletType(state) {
  return selectSelected(state, SELECTED_WALLET_TYPE_NAMESPACE);
}

export function selectWalletAccountInfo(state, key) {
  const namespace = selectWalletsNamespace(state, ACCOUNT_INFO_NAMESPACE);
  if (key) return namespace[key];
  return namespace;
}

export function selectHistory(state, key) {
  const namespace = selectWalletsNamespace(state, HISTORY_NAMESPACE);
  if (key) return namespace[key];
  return namespace;
}

function selectCurrentClient(state) {
  return state.clients.currentClient;
}

export function selectCurrentClientServices(state) {
  const currentClient = selectCurrentClient(state);
  return currentClient.services;
}

export function selectCurrentChain(state) {
  const currentClient = selectCurrentClient(state);
  return currentClient.chain;
}

// bPanel node reducer
function selectNode(state) {
  return state.node;
}

export function selectNetwork(state) {
  const node = selectNode(state);
  return node.network;
}

export function selectTheme(state) {
  return state.theme;
}
