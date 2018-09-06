const walletResponses = require('./data/walletResponses.json');

const {
  getWalletResponse,
  getMultisigResponse,
  getWalletInfoResponse,
  createWalletResponse,
} = walletResponses;


const getClientMock = () => ({
  wallet: {
    getWallets: () => {
      return Promise.resolve(getWalletResponse);
    },
    getInfo: () => {
      return Promise.resolve(getWalletInfoResponse);
    },
    createWallet: () => {
      return Promise.resolve(createWalletResponse);
    }
  },
  multisig: {
    getWallets: (type) => {
      return Promise.resolve(getMultisigResponse);
    }
  },
});

module.exports = {
  getClientMock,
}
