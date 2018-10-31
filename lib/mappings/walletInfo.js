import { selectWallet, selectAccount } from '../actions';

import {
  selectWalletInfo,
  selectMultisigWalletInfo,
  selectSelectedWallet,
  selectSelectedAccount,
  selectWalletAccounts,
  selectWalletAccountInfo,
} from './selectors';

// mapped to constants/WALLET_INFO_ACCOUNTS_LIST_HEADERS
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
  const accounts = selectWalletAccounts(state, selectedWallet);
  const accountInfo = selectWalletAccountInfo(state, selectedWallet);
  const accountOverviewList = toAccountsOverview(accountInfo);
  const selectedWalletInfo = walletInfo[selectedWallet];
  const selectedAccount = selectSelectedAccount(state);
  //const selectedAccountInfo = accountInfo[selectedAccount];
  const selectedAccountInfo = '';

  return {
    walletInfo,
    multisigWalletInfo,
    selectedWallet,
    selectedAccount,
    selectedAccountInfo,
    accounts,
    accountOverviewList,
    selectedWalletInfo,
    ...otherProps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectWallet: (walletId, type) => dispatch(selectWallet(walletId, type)),
    selectAccount: (walletId, accountId) =>
      dispatch(selectAccount(walletId, accountId)),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
