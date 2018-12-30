import { Currency } from '@bpanel/bpanel-utils';
import { Proposal } from 'bmultisig';

import {
  selectWallet,
  selectAccount,
  createAccount,
  getAccountHistory,
  getMultisigProposals,
  selectProposal,
  selectTab,
  broadcastTransaction,
  getxpubCreateWatchOnly,
  getWallets,
  joinWallet,
  sendTX,
  createAddress,
  createProposal,
  approveProposal,
  rejectProposal,
} from '../actions';

import {
  selectWalletInfo,
  selectMultisigWalletInfo,
  selectSelectedWallet,
  selectSelectedAccount,
  selectWalletAccounts,
  selectWalletAccountInfo,
  selectHistory,
  selectTheme,
  selectMultisigWalletAccounts,
  selectSelectedWalletType,
  selectCurrentChain,
  selectProposals,
  selectProposalMTX,
  selectSelectedProposal,
  selectWallets,
  selectMultisigWallets,
  selectSelectedTab,
} from './selectors';

// parse into bpanel-ui/Dropdown compatible format
// props validation will throw errors if value is
// an object
function toProposalDropdown(proposals) {
  return proposals.map(p => ({ label: p.name, value: p.name }));
}

function toPendingTable(proposals, proposalInfo, options) {
  const chain = options.chain;
  return proposals.map(p => {
    let amount;
    let recipient;
    let rate;

    if (p.name in proposalInfo) {
      const tx = proposalInfo[p.name].tx;
      // make assumption that first
      // output is the recipient
      // and the 2nd output is the change
      // not a good assumption to make
      const output = tx.outputs[0];
      amount = new Currency(chain, output.value).withLabel('unit');
      recipient = output.address;
      rate = new Currency(chain, tx.rate).withLabel('base') + 's/byte';
    }

    // check if the proposal is complete with:
    // p.statusCode === Proposal.status.APPROVED
    return {
      Name: p.name,
      Created: '', // pending bmultisig update
      Amount: amount,
      Progress: `${p.approvals.length} of ${p.m}`,
      Destination: recipient,
      Rate: rate,
      Rejections: p.rejections.length,
      Select: '', // select button set here at render time
      Complete: p.statusCode === Proposal.status.APPROVED,
    };
  });
}

function mapStateToProps(state, otherProps) {
  const walletInfo = selectWalletInfo(state);
  const multisigWalletInfo = selectMultisigWalletInfo(state);
  const selectedWallet = selectSelectedWallet(state);
  const accountInfo = selectWalletAccountInfo(state, selectedWallet);
  const selectedAccount = selectSelectedAccount(state);
  const theme = selectTheme(state);

  const wallets = selectWallets(state);
  const multisigWallets = selectMultisigWallets(state);

  const chain = selectCurrentChain(state);
  const unit = new Currency(chain).getUnit('unit');

  const walletType = selectSelectedWalletType(state);
  const standardAccounts = selectWalletAccounts(state, selectedWallet);
  const multisigAccounts = selectMultisigWalletAccounts(state, selectedWallet);

  const selectedProposal = selectSelectedProposal(state);

  // TODO handle default return value inside selector function
  let selectedTab = selectSelectedTab(state, 'sendReceive');
  if (!selectedTab) selectedTab = 0;

  let receiveAddress, selectedAccountInfo;
  try {
    selectedAccountInfo = accountInfo[selectedAccount];
    receiveAddress = selectedAccountInfo.receiveAddress;
  } catch (e) {
    // include balance to prevent undefined errors
    selectedAccountInfo = { balance: {} };
  }

  // parse selectedwalletinfo
  let selectedWalletInfo = { balance: {} };
  // multisigWalletInfo will never contain standard wallets
  if (multisigWalletInfo && selectedWallet in multisigWalletInfo)
    selectedWalletInfo = multisigWalletInfo[selectedWallet];
  else if (walletInfo && selectedWallet in walletInfo)
    selectedWalletInfo = walletInfo[selectedWallet];

  // assume not watch only
  const isWatchOnly = selectedWalletInfo.watchOnly || false;

  // select specific multisig proposals
  let msWalletProposalsInfo = {};
  const proposalmtxs = selectProposalMTX(state);
  if (selectedWallet in proposalmtxs)
    msWalletProposalsInfo = proposalmtxs[selectedWallet];

  // merge in the detailed proposal info
  const proposals = selectProposals(state);
  let tableProposals = [];
  if (selectedWallet in proposals)
    tableProposals = toPendingTable(
      proposals[selectedWallet],
      msWalletProposalsInfo,
      { chain }
    );

  let proposalDropdown = [];
  if (selectedWallet in proposals)
    proposalDropdown = toProposalDropdown(proposals[selectedWallet]);

  // parse the selected proposal info json
  let proposalInfo = {};
  try {
    proposalInfo =
      proposals[selectedWallet].find(p => p.name === selectedProposal) || {};
  } catch (e) {}

  // parse the selected proposal mtx
  let proposalMTX = {};
  let proposalRecipient = '';
  let proposalValue = '';
  try {
    proposalMTX = proposalmtxs[selectedWallet][selectedProposal];
    proposalRecipient = proposalMTX.tx.outputs[0].address;
    proposalValue = new Currency(
      chain,
      proposalMTX.tx.outputs[0].value
    ).withLabel('unit');
  } catch (e) {}

  // watch out for same wallet being included twice
  const allWallets = [];
  for (let w of wallets) allWallets.push({ value: 'standard', label: w });
  for (let msw of multisigWallets)
    allWallets.push({ value: 'multisig', label: msw });

  // TODO: this is prone to being buggy
  // should use walletType to determine which to use
  let accounts = [];
  if (multisigAccounts) accounts = multisigAccounts;
  else if (standardAccounts) accounts = standardAccounts;

  let selectedAccountBalance;
  let selectedAccountTransactionCount;
  let selectedAccountUTXOCount;
  let selectedAccountAvgUTXOSize;
  let selectedAccountxpub;
  // HACK
  if (
    accountInfo &&
    selectedAccount in accountInfo &&
    selectedAccountInfo.balance
  ) {
    selectedAccountInfo = accountInfo[selectedAccount];
    selectedAccountBalance = new Currency(
      chain,
      selectedAccountInfo.balance.confirmed
    ).withLabel('unit');
    selectedAccountTransactionCount = selectedAccountInfo.balance.tx;
    selectedAccountUTXOCount = selectedAccountInfo.balance.coin;
    // TODO: more precise calculation of avg utxo size
    // floor result because Currency doesn't like floats
    selectedAccountAvgUTXOSize = Math.floor(
      selectedAccountInfo.balance.confirmed / selectedAccountUTXOCount
    );
    // in case divide by 0
    if (Number.isNaN(selectedAccountAvgUTXOSize))
      selectedAccountAvgUTXOSize = 0;
    // parse into currency amount with label
    selectedAccountAvgUTXOSize = new Currency(
      chain,
      selectedAccountAvgUTXOSize
    ).withLabel('unit');
    selectedAccountxpub = selectedAccountInfo.accountKey;
  }

  // only parse history if there is a selected wallet
  // and a selected account, since the view shows the
  // recent transactions for the selected account
  let txhistory = [];
  if (selectedWallet && selectedAccount) {
    const history = selectHistory(state, selectedWallet);
    if (history && selectedAccount in history)
      txhistory = history[selectedAccount];
  }

  let selectedWalletBalance;
  let selectedWalletTransactionCount;
  if (selectedWalletInfo && selectedWalletInfo.balance) {
    const balance = selectedWalletInfo.balance.confirmed || 0;
    selectedWalletBalance = new Currency(chain, balance).withLabel('unit');
    selectedWalletTransactionCount = selectedWalletInfo.balance.tx;
  }

  // TODO: selectedwalletbalance
  return {
    walletInfo,
    multisigWalletInfo,
    selectedWallet,
    selectedAccount,
    selectedAccountInfo,
    selectedAccountBalance,
    selectedAccountTransactionCount,
    selectedAccountUTXOCount,
    selectedAccountAvgUTXOSize,
    selectedAccountxpub,
    selectedProposal: selectSelectedProposal(state),
    selectedWalletBalance,
    selectedWalletTransactionCount,
    accounts,
    selectedWalletInfo,
    txhistory,
    theme,
    tableProposals,
    walletType,
    isWatchOnly,
    wallets,
    multisigWallets,
    allWallets,
    receiveAddress,
    proposals,
    proposalDropdown,
    proposalMTX, // tx object
    proposalInfo, // high level info
    proposalValue,
    proposalRecipient,
    unit,
    chain,
    selectedTab,
    ...otherProps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectWallet: (walletId, type, options) =>
      dispatch(selectWallet(walletId, type, options)),
    selectAccount: (walletId, accountId, details) =>
      dispatch(selectAccount(walletId, accountId, details)),
    createAccount: (walletId, accountId, options, details) =>
      dispatch(createAccount(walletId, accountId, options, details)),
    getAccountHistory: (walletId, accountId) =>
      dispatch(getAccountHistory(walletId, accountId)),
    getMultisigProposals: walletId => dispatch(getMultisigProposals(walletId)),
    selectProposal: (walletId, proposalId, options) =>
      dispatch(selectProposal(walletId, proposalId, options)),
    selectTab: (menuId, value) => dispatch(selectTab(menuId, value)),
    broadcastTransaction: options => dispatch(broadcastTransaction(options)),
    getxpubCreateWatchOnly: async (walletId, accountId, options) =>
      dispatch(await getxpubCreateWatchOnly(walletId, accountId, options)),

    getWallets: type => dispatch(getWallets(type)),
    joinWallet: (walletId, options) => dispatch(joinWallet(walletId, options)),
    sendTX: (walletId, options) => dispatch(sendTX(walletId, options)),
    createAddress: (walletId, accountId, options) =>
      dispatch(createAddress(walletId, accountId, options)),
    createProposal: async (walletId, proposalId, options) =>
      dispatch(await createProposal(walletId, proposalId, options)),
    approveProposal: (walletId, proposalId, options) =>
      dispatch(approveProposal(walletId, proposalId, options)),
    rejectProposal: (walletId, proposalId, cosignerToken) =>
      dispatch(rejectProposal(walletId, proposalId, cosignerToken)),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
