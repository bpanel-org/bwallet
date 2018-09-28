const { updateTextField } = require('./interface');

const {
  getWallets,
  selectWallet,
  createWallet,
  getWalletInfo,
  getWalletsInfo,
  joinWallet,
  sendTX,
} = require('./wallet');

const { selectAccount } = require('./account');

const { addSideNav } = require('./interface');

module.exports = {
  sendTX,
  addSideNav,
  updateTextField,
  getWallets,
  getWalletsInfo,
  getWalletInfo,
  selectWallet,
  selectAccount,
  createWallet,
  joinWallet,
};
