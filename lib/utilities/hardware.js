import assert from 'bsert';
import { HardwareWallet, templateBIP44Account } from './index';
import { hardwareSignatures, hardwareTransaction } from './sign';
import { toMTX, toHDPublicKey } from './wrappers';

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
  const hardware = HardwareWallet.fromOptions({
    type: hardwareType,
    network,
    chain,
    logLevel: 'debug',
  });
  await hardware.initialize();

  const hdpubkey = await hardware.getPublicKey(path);
  const xpub = hdpubkey.xpubkey(network);
  await hardware.close();
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
  const { hardwareType, chain, network, pubkeys = [] } = options;
  let { path, account, proposalTX } = options;

  if (typeof account === 'string') account = parseInt(account, 10);

  if (!path) {
    assert(chain, 'chain required');
    assert(network, 'network required)');
    assert(typeof account === 'number', 'account required)');
    path = templateBIP44Account(chain, network, account);
  }

  assert(hardwareType, 'must pass hardware type');
  assert(proposalTX, 'must pass a proposal tx');

  const hardware = HardwareWallet.fromOptions({
    type: hardwareType,
    network,
    chain,
  });
  await hardware.initialize();

  // convert to HDPubkeys
  const hdpubkeys = pubkeys.map(p =>
    toHDPublicKey({ xpubkey: p, type: 'base58', chain, network })
  );
  // convert tx to TX primitive
  proposalTX.tx = toMTX(proposalTX.tx, { type: 'json', chain });

  // return signatures with hex encoding
  const signatures = await hardwareSignatures(
    hardware,
    proposalTX,
    path,
    hdpubkeys,
    'hex',
    network
  );

  await hardware.close();
  return signatures;
}

export async function signTransaction(transaction, coins, paths, options) {
  const { network, chain, hardwareType, enc } = options;

  // create hardware app
  const hardware = HardwareWallet.fromOptions({
    type: hardwareType,
    chain,
    network,
    logLevel: 'debug',
  });
  await hardware.initialize();

  const mtx = toMTX(transaction, {
    type: 'json',
    chain,
  });

  const signed = await hardwareTransaction(hardware, mtx, coins, paths);

  // make sure the transaction is valid
  if (!signed || !signed.verify()) throw new Error('invalid transaction');

  if (enc === 'hex') return signed.toRaw().toString('hex');
  if (enc === 'bytes') return signed.toRaw();

  return signed;
}
