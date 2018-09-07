const { assert } = require('chai');
const rewire = require('rewire');

const {
  WALLETS_NAMESPACE,
  ACCOUNTS_NAMESPACE,
  ACCOUNT_INFO_NAMESPACE,
  WALLET_INFO_NAMESPACE,
  BALANCE_NAMESPACE,
} = require('../lib/constants');

const { reduceWallets } = require('../lib/reducers');

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

const { getClientMock } = require('./mockClient.js');


const walletActions = rewire('../lib/actions/wallet');
walletActions.__set__('getClient', getClientMock);
const accountActions = rewire('../lib/actions/account');
accountActions.__set__('getClient', getClientMock);

const {
  getWallets,
  selectWallet,
  createWallet,
} = walletActions;

const {
  getAccountHistory,
  getAccounts,
  getAccountInfo,
  getAccountBalance,
  createAccount,
  selectAccount,
} = accountActions;

describe('wallets reducer', () => {

  it('should get wallets', async () => {
    let state;
    await getWallets()((action) => {
      state = reduceWallets(state, action);
    });
    const expected = getWalletResponse;
    assert.deepEqual(state[WALLETS_NAMESPACE], expected);
  });

  it('should get multisig wallets', async () => {
    let state;
    await getWallets('multisig')((action) => {
      state = reduceWallets(state, action);
    });
    const expected = getMultisigResponse;
    assert.deepEqual(state[WALLETS_NAMESPACE], expected);
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

  it('should get wallet accounts', async () => {
    const walletId = 'gavin';
    let state;
    await getAccounts(walletId)((action) => {
      state = reduceWallets(state, action);
    });
    const expected = getAccountsResponse;
    assert.deepEqual(state[ACCOUNTS_NAMESPACE][walletId], expected);
  });

  it('should get account info', async () => {
    const walletId = 'man';
    const accountId = 'bearpig';
    let state;
    await getAccountInfo(walletId, accountId)((action) => {
      state = reduceWallets(state, action);
    });
    const expected = getAccountInfoResponse;
    assert
      .deepEqual(state[ACCOUNT_INFO_NAMESPACE][walletId][accountId], expected);
  });

  it('should get account balance', async () => {
    const walletId = 'daniel';
    const accountId = 'krawizcz';
    let state;
    await getAccountBalance(walletId, accountId)((action) => {
      state = reduceWallets(state, action);
    });
    const expected = getAccountBalanceResponse;
    assert
      .deepEqual(state[BALANCE_NAMESPACE][walletId][accountId], expected);
  });
});

