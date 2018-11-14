import {
  selectWallets,
  selectMultisigWallets,
  selectWalletAccounts,
  selectSelectedWallet,
  selectSelectedAccount,
  selectWalletAccountInfo,
  selectSelectedWalletType,
  selectProposals,
} from './selectors';

import {
  selectWallet,
  getWallets,
  selectAccount,
  joinWallet,
  sendTX,
  createAddress,
  getMultisigProposals,
  createProposal,
  approveProposal,
  rejectProposal,
} from '../actions';

// parse into bpanel-ui/Dropdown compatible format
function toProposalDropdown(proposals) {
  return proposals.map(p => ({ label: p.name, value: p }));
}

function mapStateToProps(state, otherProps) {
  const wallets = selectWallets(state);
  const multisigWallets = selectMultisigWallets(state);
  const selectedWallet = selectSelectedWallet(state);
  const selectedAccount = selectSelectedAccount(state);

  // TODO: handle multisig/standard
  const accountInfo = selectWalletAccountInfo(state);
  let receiveAddress, selectedAccountInfo;
  try {
    selectedAccountInfo = accountInfo[selectedWallet][selectedAccount];
    receiveAddress = selectedAccountInfo.receiveAddress;
  } catch (e) {}

  // this is sometimes an object
  // and causing a bug
  // shouldn't have polymorphic returns
  let accounts = selectWalletAccounts(state, selectedWallet);
  if (!Array.isArray(accounts)) accounts = [];

  const proposals = selectProposals(state);
  let proposalDropdown;
  if (selectedWallet in proposals)
    proposalDropdown = toProposalDropdown(proposals[selectedWallet]);
  else
    proposalDropdown = [];

  // watch out for same wallet being included twice
  const allWallets = [];
  for (let w of wallets) allWallets.push({ value: 'standard', label: w });
  for (let msw of multisigWallets)
    allWallets.push({ value: 'multisig', label: msw });

  return {
    wallets,
    multisigWallets,
    allWallets,
    accounts,
    selectedWallet,
    selectedAccount,
    selectedAccountInfo,
    receiveAddress,
    proposals,
    proposalDropdown,
    walletType: selectSelectedWalletType(state),
    ...otherProps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getWallets: type => dispatch(getWallets(type)),
    selectWallet: (walletId, type) => dispatch(selectWallet(walletId, type)),
    selectAccount: (walletId, accountId) =>
      dispatch(selectAccount(walletId, accountId)),
    joinWallet: (walletId, options) => dispatch(joinWallet(walletId, options)),
    sendTX: (walletId, options) => dispatch(sendTX(walletId, options)),
    createAddress: (walletId, accountId, options) =>
      dispatch(createAddress(walletId, accountId, options)),
    getMultisigProposals: (walletId) => dispatch(getMultisigProposals(walletId)),
    createProposal: async (walletId, proposalId, options) =>
      dispatch(await createProposal(walletId, proposalId, options)),
    approveProposal: (walletId, proposalId, options) =>
      dispatch(approveProposal(walletId, proposalId, options)),
    rejectProposal: (walletId, proposalId, cosignerToken) => dispatch(rejectProposal(walletId, proposalId, cosignerToken)),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
