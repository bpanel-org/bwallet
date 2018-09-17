const { updateTextField } = require('./interface');

const { getWallets, selectWallet, createWallet, getWalletInfo } = require('./wallet');

module.exports = {
  updateTextField,
  getWallets,
  getWalletInfo,
  selectWallet,
  createWallet,
};
