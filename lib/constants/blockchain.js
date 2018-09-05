// TODO: what unit of time is this?
const HARDWARE_WALLET_TIMEOUT =
  parseInt(process.env.HARDWARE_WALLET_TIMEOUT, 10) || 100000;

module.exports = {
  HARDWARE_WALLET_TIMEOUT,
};
