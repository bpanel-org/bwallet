const { updateTextField } = require('./interface');

const {
  getWallets,
  selectWallet,
  createWallet,
  getWalletInfo,
  getWalletsInfo,
  sendTX,
} = require('./wallet');

const { selectAccount, createAddress, createAccount } = require('./account');

const { addSideNav } = require('./interface');

module.exports = {
  createAddress,
  createAccount,
  addSideNav,
  updateTextField,
  getWallets,
  getWalletsInfo,
  getWalletInfo,
  selectWallet,
  selectAccount,
  createWallet,
  sendTX,
};
