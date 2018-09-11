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
const PLUGIN_NAMESPACE = 'bwallet';
// prefix for reducers
const PLUGINS = 'plugins';
const REDUCE_INTERFACE_NAMESPACE = '@bpanel/bwallet/interface';
const REDUCE_NODE_NAMESPACE = '@bpanel/bwallet/node';
const REDUCE_CHAIN_NAMESPACE = '@bpanel/bwallet/chain';
const REDUCE_WALLETS_NAMESPACE = '@bpanel/bwallet/wallets';

const HISTORY_NAMESPACE = 'history';
const WALLETS_NAMESPACE = 'wallets';
const MULTISIG_WALLETS_NAMESPACE = 'multisigWallets';
const ACCOUNTS_NAMESPACE = 'accounts';
const WALLET_INFO_NAMESPACE = 'walletInfo';
const ACCOUNT_INFO_NAMESPACE = 'accountInfo';
const BALANCE_NAMESPACE = 'balance';
const SELECTED_WALLET_NAMESPACE = 'selectedWallet';
const SELECTED_ACCOUNT_NAMESPACE = 'selectedAccount';
const SELECTED_PROPOSAL_NAMESPACE = 'selectedProposal';
const MULTISIG_WALLET_INFO_NAMESPACE = 'multisigWalletInfo';
const MULTISIG_PROPOSAL_NAMESPACE = 'proposals';

const { UPDATE_TEXT_FIELD, TEXT_STORE_KEY } = require('./interface');

const { HARDWARE_WALLET_TIMEOUT } = require('./blockchain');

// supported input values for some actions
const SUPPORTED_ADDRESS_TYPES = ['receive', 'change', 'nested'];
const SUPPORTED_WALLET_TYPES = ['standard', 'multisig', undefined];

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
  REDUCE_CHAIN_NAMESPACE,
  REDUCE_WALLETS_NAMESPACE,
  HISTORY_NAMESPACE,
  WALLETS_NAMESPACE,
  WALLET_INFO_NAMESPACE,
  ACCOUNT_INFO_NAMESPACE,
  BALANCE_NAMESPACE,
  ACCOUNTS_NAMESPACE,
  SELECTED_WALLET_NAMESPACE,
  SELECTED_ACCOUNT_NAMESPACE,
  SELECTED_PROPOSAL_NAMESPACE,
  MULTISIG_WALLETS_NAMESPACE,
  MULTISIG_WALLET_INFO_NAMESPACE,
  MULTISIG_PROPOSAL_NAMESPACE,

  // application state
  USER_SELECT_XPUB,
  USER_SELECT_MULTISIG_PROPOSAL,
  USER_SELECT_ACCOUNT,
  USER_SELECT_MULTISIG_WALLET,

  // interface
  UPDATE_TEXT_FIELD,
  TEXT_STORE_KEY,

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
