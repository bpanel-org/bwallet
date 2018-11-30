import { Currency } from '@bpanel/bpanel-utils';

import {
  selectWallets,
  selectMultisigWallets,
  selectWalletAccounts,
  selectSelectedWallet,
  selectSelectedAccount,
  selectWalletAccountInfo,
  selectSelectedWalletType,
  selectProposals,
  selectCurrentChain,
  selectSelectedProposal,
  selectProposalMTX,
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
  selectProposal,
} from '../actions';

// parse into bpanel-ui/Dropdown compatible format
// props validation will throw errors if value is
// an object
function toProposalDropdown(proposals) {
  return proposals.map(p => ({ label: p.name, value: p.name }));
}

function mapStateToProps(state, otherProps) {
  const wallets = selectWallets(state);
  const multisigWallets = selectMultisigWallets(state);
  const selectedWallet = selectSelectedWallet(state);
  const selectedAccount = selectSelectedAccount(state);

  const chain = selectCurrentChain(state);
  const unit = new Currency(chain).getUnit('unit');

  const selectedProposal = selectSelectedProposal(state);

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

  const proposalmtxs = selectProposalMTX(state)

  const proposals = selectProposals(state);
  let proposalDropdown = [];
  if (selectedWallet in proposals)
    proposalDropdown = toProposalDropdown(proposals[selectedWallet]);

  // parse the selected proposal info json
  let proposalInfo = {}
  try {
    proposalInfo = proposals[selectedWallet].find(p => p.name === selectedProposal) || {};
  } catch (e) {}

  // parse the selected proposal mtx
  let proposalMTX = {};
  let proposalRecipient = '';
  let proposalValue = '';
  try {
    proposalMTX = proposalmtxs[selectedWallet][selectedProposal];
    proposalRecipient = proposalMTX.tx.outputs[0].address;
    proposalValue = new Currency(chain, proposalMTX.tx.outputs[0].value).withLabel('unit');
  } catch (e) {}

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
    selectedProposal, // string
    proposalMTX, // tx object
    proposalInfo, // high level info
    proposalValue,
    proposalRecipient,
    walletType: selectSelectedWalletType(state),
    unit,
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
    getMultisigProposals: walletId => dispatch(getMultisigProposals(walletId)),
    createProposal: async (walletId, proposalId, options) =>
      dispatch(await createProposal(walletId, proposalId, options)),
    approveProposal: (walletId, proposalId, options) =>
      dispatch(approveProposal(walletId, proposalId, options)),
    rejectProposal: (walletId, proposalId, cosignerToken) =>
      dispatch(rejectProposal(walletId, proposalId, cosignerToken)),
    selectProposal: (walletId, proposalId, options) => dispatch(selectProposal(walletId, proposalId, options)),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
