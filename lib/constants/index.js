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
const HISTORY_NAMESPACE = 'history';
const WALLETS_NAMESPACE = 'wallets';
const ACCOUNTS_NAMESPACE = 'accounts';
const WALLET_INFO_NAMESPACE = 'walletInfo';
const ACCOUNT_INFO_NAMESPACE = 'accountInfo';
const BALANCE_NAMESPACE = 'balance';

const {
  UPDATE_TEXT_FIELD,
  TEXT_STORE_KEY,
} = require('./interface');

const { UPDATE_TEXT_FIELD, TEXT_STORE_KEY } = require('./interface');
const { HARDWARE_WALLET_TIMEOUT } = require('./blockchain');

const {
  SET_WALLETS,
  SET_WALLET_ACCOUNTS,
  USER_SELECT_WALLET,
  SET_WALLET_INFO,
  SET_WALLET_ACCOUNT_INFO,
  SET_WALLET_ACCOUNT_BALANCE,
} = require('./wallet');

module.exports = {
  // general
  PLUGIN_NAMESPACE,
  HISTORY_NAMESPACE,
  WALLETS_NAMESPACE,
  WALLET_INFO_NAMESPACE,
  ACCOUNT_INFO_NAMESPACE,
  BALANCE_NAMESPACE,
  ACCOUNTS_NAMESPACE,

  // interface
  UPDATE_TEXT_FIELD,
  TEXT_STORE_KEY,

  // config
  HARDWARE_WALLET_TIMEOUT,

  // wallet
  SET_WALLETS,
  SET_WALLET_ACCOUNTS,
  USER_SELECT_WALLET,
  SET_WALLET_INFO,
  SET_WALLET_ACCOUNT_INFO,
  SET_WALLET_ACCOUNT_BALANCE,
>>>>>>> feature: tested wallet actions + reducer
};
