const walletResponses = require('./data/walletResponses.json');

const {
  getWalletResponse,
  getMultisigResponse,
  getWalletInfoResponse,
  createWalletResponse,
  getAccountsResponse,
  getAccountInfoResponse,
  getAccountBalanceResponse,
} = walletResponses;


const getClientMock = () => ({
  wallet: {
    getWallets: () => Promise.resolve(getWalletResponse),
    getInfo: () => Promise.resolve(getWalletInfoResponse),
    createWallet: () => Promise.resolve(createWalletResponse),
    getAccounts: () => Promise.resolve(getAccountsResponse),
    getAccount: () => Promise.resolve(getAccountInfoResponse),
    getBalance: () => Promise.resolve(getAccountBalanceResponse),
  },
  multisig: {
    getWallets: (type) => Promise.resolve(getMultisigResponse),
  },
});

module.exports = {
  getClientMock,
}
