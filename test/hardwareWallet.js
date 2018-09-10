const { assert } = require('chai');
let bcoin;

if (process.env.BROWSER) bcoin = require('bcoin/lib/bcoin-browser');
else bcoin = require('bcoin');

const { HDPublicKey } = bcoin;
const { HardwareWallet } = require('../lib/utilities');

describe('ledger hardware wallet', async () => {
  it('should construct static fromOptions', () => {
    const hardware = HardwareWallet.fromOptions('ledger');
    assert.equal(hardware instanceof HardwareWallet, true);
  });
});

// run certain tests only when device plugged in
(async () => {
  const hardware = HardwareWallet.fromOptions('ledger');
  const devices = await hardware.getDevices();

  if (devices.length > 0) {
    describe('ledger hardware required tests', async () => {
      let hardware;
      const path = "m'/44'/0'/0'/0/0";

      beforeEach(() => {
        hardware = HardwareWallet.fromOptions('ledger');
      });

      afterEach(async () => {
        await hardware.refresh();
        hardware = null;
      });

      it('should get a real ledger device', async () => {
        const devices = await hardware.getDevices();

        assert.equal(Array.isArray(devices), true);
        assert.equal(devices.length > 0, true);
      });

      it('should initialize', async () => {
        try {
          await hardware.initialize();
          assert.equal(true, true);
        } catch (e) {
          assert.fail();
        }
      });

      it('should get a public key', async () => {
        await hardware.initialize();
        const pubkey = await hardware.getPublicKey(path);
        assert.equal(pubkey instanceof HDPublicKey, true);
      });
    });
  }
})();
