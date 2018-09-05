/*
 * Constants for bwallet
 * Includes actions and plugin-wide constant values
 *
 */

const PLUGIN_NAMESPACE = 'bwallet';

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const { UPDATE_TEXT_FIELD, TEXT_STORE_KEY } = require('./interface');
const { HARDWARE_WALLET_TIMEOUT } = require('./blockchain');

module.exports = {
  UPDATE_TEXT_FIELD,
  PLUGIN_NAMESPACE,
  TEXT_STORE_KEY,
  HARDWARE_WALLET_TIMEOUT,
  LOG_LEVEL,
};
