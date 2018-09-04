const assert = require('bsert');
const blgr = require('blgr');
const { Lock } = require('bmutex');
const { HARDWARE_WALLET_TIMEOUT } = require('../constants');

// TODO: trezor support

// conditionally import based on environment
let bledger, Device;

// TODO: Temp
let DeviceInfo;

if (process.env.BROWSER) {
  bledger = require('bledger/lib/bledger-browser');
  const { U2F } = bledger;
  Device = U2F.Device;
} else {
  bledger = require('bledger');
  const { HID } = bledger;
  Device = HID.Device;
  DeviceInfo = HID.DeviceInfo;
}

const { LedgerBcoin, LedgerTXInput } = bledger;

// TODO: default to info
const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';

class HardwareWallet {
  constructor() {
    this.type = null;
    this.app = null;
    this.device = null;
    this.initialized = false;
    this.supported = ['ledger', 'trezor'];
    this.logger = new blgr(LOG_LEVEL);
  }

  fromOptions(options) {
    if (typeof options === 'string')
      this.type = options;

    if (options.type)
      this.type = options.type;

    assert(this.type !== null, 'must initialize with a hardware wallet type');
    assert(this.isValidDeviceType(this.type), `must use one of ${this.supported}, using ${this.type}`);

    return this;
  }

  isValidDeviceType(type) {
    return this.supported.includes(this.type);

  }

  static fromOptions(options) {
    return new this().fromOptions(options);
  }

  // TODO: lock...
  async getDevices(type = '', all = false) {
    const devices = [];
    if (all) {
      devices.push(...(await this.getDevices('ledger', false)));
      devices.push(...(await this.getDevices('trezor', false)));
      return devices;
    }

    if (type === '')
      type = this.type;

    assert(this.isValidDeviceType(type));

    switch (this.type) {
      case 'ledger':
        devices.push(...(await Device.getDevices()));
        break;
      case 'trezor':
        // TODO: implement
        break;
      default:
        throw new Error(`Unknown device type: ${type}`);
    }

    this.logger.debug(`found ${devices.length} hardware devices`);
    return devices;
  }

  async initialize() {
    const lock = new Lock(false);
    const unlock = await lock.lock();

    const devices = await this.getDevices();
    // TODO: figure out way to allow user to select which device
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
        case 'trezor':
          // TODO: implement
          break;
        default:
          throw new Error(`Unknown device type: ${type}`);
      }
    } catch (e) {
      this.logger.error(e);
    }

    this.initialized = true;
    unlock();
  }

  // TODO: make sure this is compatible with trezor
  async close() {
    if (this.device)
      await this.device.close();
  }

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
    const lock = new Lock(false);
    const unlock = await lock.lock();

    try {
      return await this._getPublicKey(path);
    } catch(e) {
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

      case 'trezor':
        // TODO: implement get the public key
        // turn into HDPublicKey
        return null;

      default:
        return null;
    }
  }

  getTransactionSignatures() {
    assert(this.initialized, 'must initialize a hardware device');
  }

  signTransaction() {
    assert(this.initialized, 'must initialize a hardware device');
  }

  applySignature() {
    assert(this.initialized, 'must initialize a hardware device');
  }
}

module.exports = {
  HardwareWallet,
}

