const walletResponses = require('./data/walletResponses.json');

const {
  getWalletResponse,
  getMultisigResponse,
  getWalletInfoResponse,
  getMSWalletInfoResponse,
  createMSWalletResponse,
  createWalletResponse,
  getAccountsResponse,
  getAccountInfoResponse,
  getAccountBalanceResponse,
  getAccountHistoryResponse,
  createAccountResponse,
  getProposalMTXResponse,
} = walletResponses;

const getClient = () => ({
  wallet: {
    getWallets: () => Promise.resolve(getWalletResponse),
    getInfo: () => Promise.resolve(getWalletInfoResponse),
    createWallet: () => Promise.resolve(createWalletResponse),
    getAccounts: () => Promise.resolve(getAccountsResponse),
    getAccount: () => Promise.resolve(getAccountInfoResponse),
    getBalance: () => Promise.resolve(getAccountBalanceResponse),
    getHistory: () => Promise.resolve(getAccountHistoryResponse),
    createAccount: () => Promise.resolve(createAccountResponse),
  },
  multisig: {
    getInfo: () => Promise.resolve(getMSWalletInfoResponse),
    getWallets: () => Promise.resolve(getMultisigResponse),
    getProposalMTX: () => Promise.resolve(getProposalMTXResponse),
    createWallet: () => Promise.resolve(createMSWalletResponse),
  },
});

export { getClient };
