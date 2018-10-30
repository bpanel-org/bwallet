import { tobip44Account } from '../lib/utilities';
import { assert } from 'chai';
import { AssertionError } from 'bsert';

describe('bip 44 account path templating', () => {
  it('should template bitcoin mainnet', () => {
    assert.equal(tobip44Account('bitcoin', 'main', 0), "m'/44'/0'/0'");
  });

  it('should template bitcoin testnet', () => {
    assert.equal(tobip44Account('bitcoin', 'testnet', 0), "m'/44'/1'/0'");
  });

  it('should template bitcoin mainnet account 1', () => {
    assert.equal(tobip44Account('bitcoin', 'main', 1), "m'/44'/0'/1'");
  });

  it('should template bitcoin cash main account 1', () => {
    assert.equal(tobip44Account('bitcoincash', 'main', 1), "m'/44'/145'/1'");
  });

  it('should template handshake main account 0', () => {
    assert.equal(tobip44Account('handshake', 'main', 0), "m'/44'/5353'/0'");
  });

  it('should throw error for negative account number', () => {
    try {
      tobip44Account('bitcoin', 'main', -1);
    } catch (e) {
      assert.instanceOf(e, AssertionError);
    }
  });

  it('should throw error for a too large of account number', () => {
    try {
      tobip44Account('bitcoin', 'main', 80000001);
    } catch (e) {
      assert.instanceOf(e, AssertionError);
    }
  });
});
