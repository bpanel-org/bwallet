const { updateTextField } = require('./interface');

const {
  getWallets,
  selectWallet,
  createWallet,
  getWalletInfo,
  getWalletsInfo,
} = require('./wallet');

const { selectAccount, createAddress } = require('./account');

const { addSideNav } = require('./interface');

module.exports = {
  createAddress,
  addSideNav,
  updateTextField,
  getWallets,
  getWalletsInfo,
  getWalletInfo,
  selectWallet,
  selectAccount,
  createWallet,
};
