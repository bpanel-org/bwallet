import assert from 'bsert';
import { HardwareWallet, tobip44Account } from './index';

export async function getxpub(options) {
  const { chain, network, account, hardwareType } = options;

  assert(chain, 'getxpub(options.chain) required');
  assert(network, 'getxpub(options.network) required)');
  assert(account, 'getxpub(options.account) required)');
  assert(hardwareType, 'getxpub(options.hardwareType) required');

  const path = tobip44Account(chain, network, account);
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
