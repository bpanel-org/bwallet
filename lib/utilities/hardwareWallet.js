const assert = require('bsert');
const blgr = require('blgr');
const { Lock } = require('bmutex');
const { HARDWARE_WALLET_TIMEOUT, LOG_LEVEL } = require('../constants');

// conditionally import based on environment
let bledger, Device;

if (process.env.BROWSER) {
  // NOTE: depending on webpack config to resolve
  // bledger/lib/bledger-browser to bledger
  bledger = require('bledger');
  const { U2F } = bledger;
  Device = U2F.Device;
} else {
  bledger = require('bledger');
  const { HID } = bledger;
  Device = HID.Device;
}

const { LedgerBcoin } = bledger;

/**
 * Create general hardware wallet
 * Single interface for multiple types
 * of hardware wallets
 * TODO: add trezor support
 */
class HardwareWallet {
  /**
   * Create Hardware Wallet
   * @constructor
   * @param {Object|String} options
   * @param {String} options.type
   */
  constructor(options) {
    this.type = null;
    this.app = null;
    this.device = null;
    this.initialized = false;
    this.supported = ['ledger']; // TODO: add 'trezor'
    this.logger = new blgr(LOG_LEVEL);
    this.lock = new Lock(false);

    if (options) this.fromOptions(options);
  }

  /**
   * Initialize from options
   * @returns {void}
   */
  fromOptions(options) {
    if (typeof options === 'string') this.type = options;

    if (options.type) this.type = options.type;

    assert(this.type !== null, 'must initialize with a hardware wallet type');
    assert(
      this.isValidDeviceType(this.type),
      `must use one of ${this.supported}, using ${this.type}`
    );

    return this;
  }

  /**
   * Get device compatibility
   * @param {string} type - hardware wallet type
   * @returns {boolean}
   */
  isValidDeviceType(type) {
    return this.supported.includes(type);
  }

  static fromOptions(options) {
    return new this().fromOptions(options);
  }

  /**
   * Get devices on machine
   * @param {string} type - hardware wallet type
   * @param {boolean} all - return all devices
   *   overrides type argument
   * @returns {[]object}
   *
   * TODO: add lock
   */
  async getDevices(type = '', all = false) {
    const devices = [];
    if (all) {
      devices.push(...(await this.getDevices('ledger', false)));
      return devices;
    }

    if (type === '') type = this.type;

    assert(this.isValidDeviceType(type));

    switch (this.type) {
      case 'ledger':
        devices.push(...(await Device.getDevices()));
        break;
      default:
        throw new Error(`Unknown device type: ${type}`);
    }

    this.logger.debug(`found ${devices.length} hardware devices`);
    return devices;
  }

  /**
   * Initialize connection with hardware device
   * @returns {void}
   *
   * TODO: figure out way to allow user to select which device
   */
  async initialize() {
    const unlock = await this.lock.lock();

    const devices = await this.getDevices();
    const device = devices[0];

    assert(this.initialized === false, 'cannot initialize twice');

    try {
      switch (this.type) {
        case 'ledger':
          this.device = new Device({
            device: device,
            timeout: HARDWARE_WALLET_TIMEOUT,
          });
          await this.device.open();
          this.app = new LedgerBcoin({ device: this.device });
          break;

        default:
          throw new Error(`Unknown device type: ${this.type}`);
      }

      this.initialized = true;
    } catch (e) {
      this.logger.error(e);
    } finally {
      unlock();
    }
  }

  /**
   * Close connection with hardware device
   * @returns {void}
   *
   * TODO: ensure compatibility between devices
   */
  async close() {
    if (this.device) await this.device.close();
  }

  /**
   * Close connection with hardware device
   * and reset state
   * @returns {void}
   */
  async refresh() {
    this.initialized = false;
    await this.close();

    this.device = null;
    this.app = null;
  }

  /**
   * Get public key with lock
   * @param {string} path - bip 39 path
   * @returns bcoin.HDPublicKey
   */
  async getPublicKey(path) {
    assert(this.initialized, 'must initialize a hardware device');
    const unlock = await this.lock.lock();

    try {
      return await this._getPublicKey(path);
    } catch (e) {
      this.logger.error(e);
      this.logger.error(e.stack);
    } finally {
      unlock();
    }
  }

  /**
   * Get public key without lock
   * @private
   * @param {string} path - bip 39 path
   * @returns bcoin.HDPublicKey
   */
  async _getPublicKey(path) {
    switch (this.type) {
      case 'ledger':
        return await this.app.getPublicKey(path);

      default:
        return null;
    }
  }

  /**
   * Get signatures for transaction.
   * @param {bcoin.TX|bcoin.MTX|Buffer} tx - transaction
   * @param {bcoin.CoinView|Buffer} view
   * @param {LedgerTXInput[]} ledgerInputs
   * @returns {Buffer[]}
   * @throws {LedgerError}
   * @throws {AssertionError}
   */
  async getTransactionSignatures(tx, view, ledgerInputs) {
    assert(this.initialized, 'must initialize a hardware device');
    const unlock = await this.lock.lock();

    try {
      return await this._getTransactionSignatures(tx, view, ledgerInputs);
    } catch (e) {
      this.logger.error(e);
      this.logger.error(e.stack);
    } finally {
      unlock();
    }
  }

  async _getTransactionSignatures(tx, view, ledgerInputs) {
    switch (this.type) {
      case 'ledger':
        return await this.app.getTransactionSignatures(tx, view, ledgerInputs);

      default:
        return null;
    }
  }

  /**
   * Sign transaction with lock.
   * @param {bcoin.MTX} tx - mutable transaction
   * @param {LedgerTXInput[]} ledgerInputs
   * @returns {MTX} - signed mutable transaction
   * @throws {LedgerError}
   * @throws {AssertionError}
   */
  async signTransaction(tx, ledgerInputs) {
    assert(this.initialized, 'must initialize a hardware device');
    const unlock = await this.lock.lock();

    try {
      return await this._signTransaction(tx, ledgerInputs);
    } catch (e) {
      this.logger.error(e);
      this.logger.error(e.stack);
    } finally {
      unlock();
    }
  }

  async _signTransaction(tx, ledgerInputs) {
    switch (this.type) {
      case 'ledger':
        return await this.app.signTransaction(tx, ledgerInputs);

      default:
        return null;
    }
  }

  /**
   * Apply signature to transaction.
   * @param {bcoin.MTX} tx
   * @param {Number} index - index of the input
   * @param {LedgerTXInput} ledgerInput
   * @param {Buffer} sig - raw signature
   * @returns {Boolean}
   * @throws {Error}
   */
  async applySignature(tx, index, ledgerInput, sig) {
    assert(this.initialized, 'must initialize a hardware device');
    const unlock = await this.lock.lock();

    try {
      return await this._applySignature(tx, index, ledgerInput, sig);
    } catch (e) {
      this.logger.error(e);
      this.logger.error(e.stack);
    } finally {
      unlock();
    }
  }

  async _applySignature(tx, index, ledgerInput, sig) {
    switch (this.type) {
      case 'ledger':
        return await this.app.applySignature(tx, index, ledgerInput, sig);

      default:
        return null;
    }
  }
}

module.exports = {
  HardwareWallet,
};
