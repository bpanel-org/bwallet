import assert from 'bsert';
import { HardwareWallet, templateBIP44Account } from './index';
import { hardwareSignatures, hardwareTransaction } from './sign';
import { toMTX } from './wrappers';

export async function getxpub(options) {
  const { chain, network, hardwareType } = options;
  let { account } = options;
  let { path } = options;

  if (typeof account === 'string') account = parseInt(account, 10);

  if (!path) {
    assert(chain, 'getxpub(options.chain) required');
    assert(network, 'getxpub(options.network) required)');
    assert(typeof account === 'number', 'getxpub(options.account) required)');
    path = templateBIP44Account(chain, network, account);
  }

  assert(hardwareType, 'getxpub(options.hardwareType) required');
  const hardware = HardwareWallet.fromOptions(hardwareType);
  await hardware.initialize();
  const hdpubkey = await hardware.getPublicKey(path);
  await hardware.close();
  const xpub = hdpubkey.xpubkey(network);
  assert(xpub, 'must have defined xpub');

  return {
    xpub,
    path,
  };
}

/*
 * get signature from hardware wallet device
 * @param {Object} options
 */
export async function getHardwareSignatures(options) {
  const { hardwareType, proposalTX, chain, network } = options;
  let { path, account } = options;

  if (typeof account === 'string') account = parseInt(account, 10);

  if (!path) {
    assert(chain, 'chain required');
    assert(network, 'network required)');
    assert(typeof account === 'number', 'account required)');
    path = templateBIP44Account(chain, network, account);
  }

  assert(hardwareType, 'must pass hardware type');
  assert(proposalTX, 'must pass a proposal tx');

  const hardware = HardwareWallet.fromOptions(hardwareType);
  await hardware.initialize();

  // return signatures with hex encoding
  const signatures = await hardwareSignatures(
    hardware,
    proposalTX,
    path,
    'hex'
  );

  await hardware.close();
  return signatures;
}

// TODO: add dropdown on frontend
// for hardwaretype
export async function signTransaction(transaction, coins, paths, options) {
  const { chain, hardwareType, enc } = options;

  // create ledger app
  const hardware = HardwareWallet.fromOptions(hardwareType);
  await hardware.initialize();

  const mtx = toMTX(transaction, {
    type: 'json',
    chain,
  });

  const signed = await hardwareTransaction(hardware, mtx, coins, paths);

  // make sure the transaction is valid
  if (!signed.verify())
    throw new Error('invalid transaction');

  if (enc === 'hex') return signed.toRaw().toString('hex');
  if (enc === 'bytes') return signed.toRaw();

  return signed;
}
