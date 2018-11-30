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
  getMultisigProposals,
  createProposal,
  approveProposal,
  rejectProposal,
  selectProposal,
} = require('./wallet');

const {
  selectAccount,
  createAddress,
  createAccount,
  getxpubCreateWatchOnly,
  getAccountHistory,
} = require('./account');

const { addSideNav } = require('./interface');

module.exports = {
  createAddress,
  createProposal,
  createAccount,
  addSideNav,
  joinWallet,
  updateTextField,
  getAccountHistory,
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
  getMultisigProposals,
  approveProposal,
  rejectProposal,
  selectProposal,
};
