const { updateTextField } = require('./interface');

const {
  getWallets,
  selectWallet,
  createWallet,
  getWalletInfo,
  getWalletsInfo,
  joinWallet,
} = require('./wallet');

const { selectAccount } = require('./account');

const { addSideNav } = require('./interface');

module.exports = {
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
