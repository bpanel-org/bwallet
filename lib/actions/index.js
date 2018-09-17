const { updateTextField } = require('./interface');

const {
  getWallets,
  selectWallet,
  createWallet,
  getWalletInfo,
} = require('./wallet');

const { selectAccount } = require('./account');

module.exports = {
  updateTextField,
  getWallets,
  getWalletInfo,
  selectWallet,
  selectAccount,
  createWallet,
};
