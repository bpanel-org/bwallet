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

/**
 * Index at which hardening begins.
 * @const {Number}
 * @default
 */

const HARDENED = 0x80000000;

/**
 * Parse a derivation path and return an array of indexes.
 * @see https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
 * @param {String} path
 * @param {Boolean} hard
 * @returns {Number[]}
 */

// TODO: move this into bpanel utils
export function parsePath(path, hard) {
  assert(typeof path === 'string');
  assert(typeof hard === 'boolean');
  assert(path.length >= 1);
  assert(path.length <= 3062);

  const parts = path.split('/');
  const root = parts[0];

  if (root !== 'm'
      && root !== 'M'
      && root !== 'm\''
      && root !== 'M\'') {
    throw new Error('Invalid path root.');
  }

  const result = [];

  for (let i = 1; i < parts.length; i++) {
    let part = parts[i];

    const hardened = part[part.length - 1] === '\'';

    if (hardened)
      part = part.slice(0, -1);

    if (part.length > 10)
      throw new Error('Path index too large.');

    if (!/^\d+$/.test(part))
      throw new Error('Path index is non-numeric.');

    let index = parseInt(part, 10);

    if ((index >>> 0) !== index)
      throw new Error('Path index out of range.');

    if (hardened) {
      index |= HARDENED;
      index >>>= 0;
    }

    if (!hard && (index & HARDENED))
      throw new Error('Path index cannot be hardened.');

    result.push(index);
  }

  return result;
};
