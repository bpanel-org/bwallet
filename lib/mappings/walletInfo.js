import { Currency } from '@bpanel/bpanel-utils';

import {
  selectWallet,
  selectAccount,
  createAccount,
  getAccountHistory,
  getMultisigProposals,
  selectProposal,
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
} from './selectors';

/*
 * key names in objects here correspond to
 * table headers which are defined in the list
 * bwallet/lib/constants/WALLET_INFO_ACCOUNTS_LIST_HEADERS
 * the keys and values in the list must match or the table
 * will not render
 */
function toAccountsOverview(chain, accountInfo = {}) {
  return Object.values(accountInfo).map(account => ({
    Name: account.name,
    Balance: new Currency(chain, account.balance.confirmed).withLabel('unit'),
    Address: account.receiveAddress,
    'Watch Only': `${account.watchOnly}`,
  }));
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
      rate = new Currency(chain, tx.rate).withLabel('base') + '/byte';
    }

    return {
      Name: p.name,
      Created: '', // pending bmultisig update
      Amount: amount,
      Progress: `${p.approvals.length} of ${p.m}`,
      Destination: recipient,
      Rate: rate,
      Rejections: p.rejections.length,
      Select: '',
    };
  });
}

function mapStateToProps(state, otherProps) {
  const walletInfo = selectWalletInfo(state);
  const multisigWalletInfo = selectMultisigWalletInfo(state);
  const selectedWallet = selectSelectedWallet(state);
  const accountInfo = selectWalletAccountInfo(state, selectedWallet);
  const selectedWalletInfo = walletInfo[selectedWallet];
  const selectedAccount = selectSelectedAccount(state);
  const theme = selectTheme(state);

  const chain = selectCurrentChain(state);
  const accountOverviewList = toAccountsOverview(chain, accountInfo);

  const walletType = selectSelectedWalletType(state);
  const standardAccounts = selectWalletAccounts(state, selectedWallet);
  const multisigAccounts = selectMultisigWalletAccounts(state, selectedWallet);

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

  // TODO: this is prone to being buggy
  // should use walletType to determine which to use
  let accounts = [];
  if (multisigAccounts) accounts = multisigAccounts;
  else if (standardAccounts) accounts = standardAccounts;

  // TODO: bug with multisig?
  // include balance to prevent undefined errors
  let selectedAccountInfo = { balance: {} };
  let selectedAccountBalance;
  if (accountInfo && selectedAccount in accountInfo) {
    selectedAccountInfo = accountInfo[selectedAccount];
    selectedAccountBalance = new Currency(
      chain,
      selectedAccountInfo.balance.confirmed
    ).withLabel('unit');
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

  return {
    walletInfo,
    multisigWalletInfo,
    selectedWallet,
    selectedAccount,
    selectedAccountInfo,
    selectedAccountBalance,
    accounts,
    accountOverviewList,
    selectedWalletInfo,
    txhistory,
    theme,
    tableProposals,
    walletType,
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
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
