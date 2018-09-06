const { assert } = require('chai');
const rewire = require('rewire');

const {
  WALLETS_NAMESPACE,
  WALLET_INFO_NAMESPACE,
} = require('../lib/constants');

const { reduceWallets } = require('../lib/reducers');

const walletResponses = require('./data/walletResponses.json');

const {
  getWalletResponse,
  getMultisigResponse,
  getWalletInfoResponse,
  createWalletResponse,
} = walletResponses;

const { getClientMock } = require('./mockClient.js');


const walletActions = rewire('../lib/actions/wallet');
walletActions.__set__('getClient', getClientMock);

const {
  getWallets,
  selectWallet,
  createWallet,
} = walletActions;

describe('wallets reducer', () => {

  it('should get wallets', async () => {
    await getWallets()((action) => {
      const newState = reduceWallets(undefined, action);
      const expected = getWalletResponse;
      assert.deepEqual(newState[WALLETS_NAMESPACE], expected);
    });
  });

  it('should get multisig wallets', async () => {
    await getWallets('multisig')((action) => {
      const newState = reduceWallets(undefined, action);
      const expected = getMultisigResponse;
      assert.deepEqual(newState[WALLETS_NAMESPACE], expected);
    });
  });

  it('should select wallet', async () => {
    const walletId = 'foobar';
    let state;
    await selectWallet(walletId)((action) => {
      state = reduceWallets(state, action);
    });
    const expected = getWalletInfoResponse;
    assert.deepEqual(state[WALLET_INFO_NAMESPACE][walletId], expected);
  });

  it('should create wallet', async () => {
    const walletId = 'satoshis vision';
    let state;
    await createWallet(walletId)((action) => {
      state = reduceWallets(state, action);
    })
    const expected = createWalletResponse;
    assert.deepEqual(state[WALLET_INFO_NAMESPACE][walletId], expected);
  });
});

