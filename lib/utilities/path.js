import { COIN_TYPES } from '@bpanel/bpanel-utils';
import assert from 'bsert';

/*
 * TODO: rename in codebase to templateBIP44Path
 * NOTE: this is ux optimized and will automatically
 * make each level hardened, so don't try to use
 * 2**31-1 < account < 2**32
 */
export function templateBIP44Account(chain, network, account) {
  assert(chain in COIN_TYPES, `chain not supported: ${chain}`);
  const coinType = COIN_TYPES[chain];
  assert(network in coinType, `network not supported: ${network}`);
  const type = coinType[network];

  // render with account if it is passed
  if (account !== undefined) {
    assert(typeof account === 'number', 'account must be number');
    assert(account >= 0, 'account must be >= 0');
    assert(
      account < 0x80000000,
      'account is hardened, must be less than 2**31'
    );
    return `m'/44'/${type}'/${account}'`;
  }

  // just render up to the type
  return `m'/44'/${type}'`;
}
