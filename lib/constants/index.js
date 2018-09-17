/*
 * Constants for bwallet
 * Includes actions and plugin-wide constant values
 *
 */

/*
 * redux namespace constants
 * will easily allow for rescoping
 * in the redux store in case
 * of collisions with other plugins
 */

// top level reducer name
const PLUGINS = 'plugins';
// bwallet application reducer namespace
const PLUGIN_NAMESPACE = 'bwallet';

// namespace for each application reducer
const REDUCE_INTERFACE_NAMESPACE = 'interface';
const REDUCE_NODE_NAMESPACE = 'node';
const REDUCE_WALLETS_NAMESPACE = 'wallets';
const REDUCE_APP_NAMESPACE = 'app';

const APP_NAMESPACES = {
  SELECTED_WALLET_NAMESPACE: 'selectedWallet',
  SELECTED_ACCOUNT_NAMESPACE: 'selectedAccount',
  SELECTED_PROPOSAL_NAMESPACE: 'selectedProposal',
};

const WALLETS_NAMESPACES = {
  MULTISIG_WALLET_INFO_NAMESPACE: 'multisigWalletInfo',
  WALLETS_NAMESPACE: 'wallets',
  MULTISIG_WALLETS_NAMESPACE: 'multisigWallets',
  WALLET_INFO_NAMESPACE: 'walletInfo',
  ACCOUNT_INFO_NAMESPACE: 'accountInfo',
  BALANCE_NAMESPACE: 'balance',
  ACCOUNTS_NAMESPACE: 'accounts',
  HISTORY_NAMESPACE: 'history',
  MULTISIG_PROPOSAL_NAMESPACE: 'proposals',
};

const INTERFACE_NAMESPACES = {
  TEXT_STORE_NAMESPACE: 'textFields',
};

const UPDATE_TEXT_FIELD = 'UPDATE_TEXT_FIELD';

const { HARDWARE_WALLET_TIMEOUT } = require('./blockchain');

// supported input values for some actions
const SUPPORTED_ADDRESS_TYPES = ['receive', 'change', 'nested'];
const SUPPORTED_WALLET_TYPES = ['standard', 'multisig', undefined, 'all'];

const {
  SET_WALLETS,
  SET_WALLET_ACCOUNTS,
  USER_SELECT_WALLET,
  SET_WALLET_INFO,
  SET_WALLET_ACCOUNT_INFO,
  SET_WALLET_ACCOUNT_BALANCE,
  SET_MULTISIG_PROPOSAL_MTX,
  SET_MULTISIG_WALLETS,
  SET_MULTISIG_WALLET_INFO,
} = require('./wallet');

const {
  USER_SELECT_XPUB,
  USER_SELECT_MULTISIG_PROPOSAL,
  USER_SELECT_ACCOUNT,
  USER_SELECT_MULTISIG_WALLET,
} = require('./bwallet');

module.exports = {
  // general
  PLUGIN_NAMESPACE,
  PLUGINS,
  REDUCE_INTERFACE_NAMESPACE,
  REDUCE_NODE_NAMESPACE,
  REDUCE_WALLETS_NAMESPACE,
  REDUCE_APP_NAMESPACE,

  WALLETS_NAMESPACES,
  INTERFACE_NAMESPACES,
  APP_NAMESPACES,

  // application state
  USER_SELECT_XPUB,
  USER_SELECT_MULTISIG_PROPOSAL,
  USER_SELECT_ACCOUNT,
  USER_SELECT_MULTISIG_WALLET,

  // interface
  UPDATE_TEXT_FIELD,

  // config
  HARDWARE_WALLET_TIMEOUT,
  SUPPORTED_ADDRESS_TYPES,
  SUPPORTED_WALLET_TYPES,

  // wallet
  SET_WALLETS,
  SET_WALLET_ACCOUNTS,
  SET_MULTISIG_WALLETS,
  USER_SELECT_WALLET,
  SET_WALLET_INFO,
  SET_WALLET_ACCOUNT_INFO,
  SET_WALLET_ACCOUNT_BALANCE,
  SET_MULTISIG_PROPOSAL_MTX,
  SET_MULTISIG_WALLET_INFO,
};
