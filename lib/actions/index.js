const { updateTextField } = require('./interface');

const {
  getWallets,
  selectWallet,
  createWallet,
  getWalletInfo,
  getWalletsInfo,
  sendTX,
  joinWallet,
  getxpubCreateMultisigWallet,
  setTemporarySecrets,
} = require('./wallet');

const {
  selectAccount,
  createAddress,
  createAccount,
  getxpubCreateWatchOnly,
} = require('./account');

const { addSideNav } = require('./interface');

module.exports = {
  createAddress,
  createAccount,
  addSideNav,
  joinWallet,
  updateTextField,
  getWallets,
  getWalletsInfo,
  getWalletInfo,
  selectWallet,
  selectAccount,
  createWallet,
  sendTX,
  getxpubCreateWatchOnly,
  getxpubCreateMultisigWallet,
  setTemporarySecrets,
};
