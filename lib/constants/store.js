/*
 * redux namespace constants
 * will easily allow for rescoping
 * in the redux store in case
 * of collisions with other plugins
 */

// top level reducer name
export const PLUGINS = 'plugins';
// bwallet application reducer namespace
export const PLUGIN_NAMESPACE = 'bwallet';

// namespace for each application reducer
export const REDUCE_INTERFACE_NAMESPACE = 'interface';
export const REDUCE_NODE_NAMESPACE = 'node';
export const REDUCE_WALLETS_NAMESPACE = 'wallets';
export const REDUCE_APP_NAMESPACE = 'app';

export const APP_NAMESPACES = {
  SELECTED_WALLET_NAMESPACE: 'selectedWallet',
  SELECTED_ACCOUNT_NAMESPACE: 'selectedAccount',
  SELECTED_PROPOSAL_NAMESPACE: 'selectedProposal',
  SELECTED_WALLET_TYPE_NAMESPACE: 'selectedWalletType',
};

export const WALLETS_NAMESPACES = {
  MULTISIG_WALLET_INFO_NAMESPACE: 'multisigWalletInfo',
  WALLETS_NAMESPACE: 'wallets',
  MULTISIG_WALLETS_NAMESPACE: 'multisigWallets',
  WALLET_INFO_NAMESPACE: 'walletInfo',
  ACCOUNT_INFO_NAMESPACE: 'accountInfo',
  MULTISIG_ACCOUNT_INFO_NAMESPACE: 'multisigAccountInfo',
  BALANCE_NAMESPACE: 'balance',
  ACCOUNTS_NAMESPACE: 'accounts',
  HISTORY_NAMESPACE: 'history',
  MULTISIG_PROPOSALS_NAMESPACE: 'proposals',
  MULTISIG_PROPOSAL_NAMESPACE: 'proposalMTXs',
  MULTISIG_ACCOUNTS_NAMESPACE: 'multisigAccounts',
  TX_STATUS_SUCCESS_NAMESPACE: 'successfulTx',
  TX_STATUS_FAILURE_NAMESPACE: 'failedTx',
  TEMPORARY_SECRETS_NAMESPACE: 'temporarySecrets',
};

export const INTERFACE_NAMESPACES = {
  TEXT_STORE_NAMESPACE: 'textFields',
  TAB_STORE_NAMESPACE: 'tabIndex',
};
