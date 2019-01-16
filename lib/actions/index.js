const {
  updateTextField,
  addSideNav,
  selectTab,
  removeSideNav,
} = require('./interface');

const {
  getWallets,
  selectWallet,
  createWallet,
  getWalletInfo,
  getWalletsInfo,
  sendTX,
  joinWallet,
  getxpubCreateMultisigWallet,
  getxpubCreateWatchOnlyWallet,
  setTemporarySecrets,
  getMultisigProposals,
  createProposal,
  approveProposal,
  rejectProposal,
  clearWallets,
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
  clearWallets,
  createAddress,
  createProposal,
  createAccount,
  addSideNav,
  removeSideNav,
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
  getxpubCreateWatchOnly, // watch only account
  getxpubCreateWatchOnlyWallet,
  getxpubCreateMultisigWallet,
  setTemporarySecrets,
  getMultisigProposals,
  approveProposal,
  rejectProposal,
  selectProposal,
  selectTab,
};
