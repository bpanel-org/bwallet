import {
  selectWallet,
  selectAccount,
  createAccount,
  getAccountHistory,
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
} from './selectors';

/*
 * key names in objects here correspond to
 * table headers which are defined in the list
 * bwallet/lib/constants/WALLET_INFO_ACCOUNTS_LIST_HEADERS
 * the keys and values in the list must match or the table
 * will not render
 */
function toAccountsOverview(accountInfo = {}) {
  return Object.values(accountInfo).map(account => ({
    Name: account.name,
    Balance: account.balance.confirmed,
    Address: account.receiveAddress,
    'Watch Only': `${account.watchOnly}`,
  }));
}

function mapStateToProps(state, otherProps) {
  const walletInfo = selectWalletInfo(state);
  const multisigWalletInfo = selectMultisigWalletInfo(state);
  const selectedWallet = selectSelectedWallet(state);
  const accountInfo = selectWalletAccountInfo(state, selectedWallet);
  const accountOverviewList = toAccountsOverview(accountInfo);
  const selectedWalletInfo = walletInfo[selectedWallet];
  const selectedAccount = selectSelectedAccount(state);
  const theme = selectTheme(state);

  const walletType = selectSelectedWalletType(state);
  const standardAccounts = selectWalletAccounts(state, selectedWallet);
  const multisigAccounts = selectMultisigWalletAccounts(state, selectedWallet);

  // TODO: this is prone to being buggy
  // should use walletType to determine which to use
  let accounts = [];
  if (multisigAccounts)
    accounts = multisigAccounts;
  else if (standardAccounts)
    accounts = standardAccounts;

  // include balance to prevent undefined errors
  // TODO: calculate balance here instead and pass as individual prop
  // use network specific units
  let selectedAccountInfo = { balance: {} };
  if (accountInfo && selectedAccount in accountInfo)
    selectedAccountInfo = accountInfo[selectedAccount];

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
    accounts,
    accountOverviewList,
    selectedWalletInfo,
    txhistory,
    theme,
    walletType,
    ...otherProps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectWallet: (walletId, type) => dispatch(selectWallet(walletId, type)),
    selectAccount: (walletId, accountId, details) =>
      dispatch(selectAccount(walletId, accountId, details)),
    createAccount: (walletId, accountId, options, details) =>
      dispatch(createAccount(walletId, accountId, options, details)),
    getAccountHistory: (walletId, accountId) =>
      dispatch(getAccountHistory(walletId, accountId)),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
