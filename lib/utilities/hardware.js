import assert from 'bsert';
import { HardwareWallet, templateBIP44Account } from './index';

export async function getxpub(options) {
  const { chain, network, account, hardwareType } = options;
  let { path } = options;

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
