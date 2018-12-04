const { updateTextField, addSideNav, selectTab } = require('./interface');

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
  broadcastTransaction,
} = require('./wallet');

const {
  selectAccount,
  createAddress,
  createAccount,
  getxpubCreateWatchOnly,
  getAccountHistory,
} = require('./account');

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
  broadcastTransaction,
  getxpubCreateWatchOnly,
  getxpubCreateMultisigWallet,
  setTemporarySecrets,
  getMultisigProposals,
  approveProposal,
  rejectProposal,
  selectProposal,
  selectTab,
};
