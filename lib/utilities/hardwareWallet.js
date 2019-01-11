// TODO: switch to import syntax
const assert = require('bsert');
const blgr = require('blgr');
const { Lock } = require('bmutex');
const { HARDWARE_WALLET_TIMEOUT, LOG_LEVEL } = require('../constants');
const bledger = require('bledger');
const { toHDPublicKey } = require('./wrappers');
const { parsePath } = require('./path');

/*
 * NOTE: for front end usage, webpack config
 * resolves bledger/lib/bledger-browser to bledger
 */

let Device;

/*
 * use a single logger for this file
 * so that both classes can use the same
 * logger
 */

const logger = new blgr(LOG_LEVEL);
logger.open();

const trezor = require('trezor.js');
const TrezorConnect = require('trezor-connect').default;

class TrezorManager {
  constructor() {
    this.debug = false;
    this.devices = [];
    this.logger = logger;
    this.init();
  }

  init() {
    const list = new trezor.DeviceList({ debug: this.debug });

    list.on('connect', device => {
      // grab a reference to the device
      const id = device.features.device_id;

      this.logger.info('trezor device %s connected', id);
      this.devices.push(device);

      device.on('disconnect', () => {
        this.logger.info('trezor device %s disconnected', id);
        this.devices = this.devices.filter(d => {
          return d.features.device_id !== id;
        });
      });
    });
  }

  getDevices() {
    return this.devices;
  }

  getDevice() {
    return this.devices[0];
  }
}

// HACK
// global trezorManager in scope for HardwareWallet
// to access
const trezorManager = new TrezorManager();

if (process.env.BROWSER) {
  const { U2F } = bledger;
  Device = U2F.Device;
} else {
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
    this.chain = null; // bitcoin, bitcoincash, handshake
    this.network = null; // main, test, regtest
    this.type = null; // device type

    this.app = null;
    this.device = null;
    this.initialized = false;
    this.supported = ['ledger', 'trezor', 'all'];
    this.logger = logger;
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

    if (options.chain) this.chain = options.chain;

    if (options.network) this.network = options.network;

    if (options.logLevel) {
      this.logger.setLevel(options.logLevel);
      // open the logger if its closed
      if (this.logger.closed) this.logger.open();
    }

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
  async getDevices(type = '') {
    const devices = [];

    if (type === '') type = this.type;

    if (type === 'all') {
      devices.push(...(await this.getDevices('ledger')));
      devices.push(...(await this.getDevices('trezor')));
      return devices;
    }

    assert(this.isValidDeviceType(type));

    switch (type) {
      case 'ledger':
        devices.push(...(await Device.getDevices()));
        break;
      case 'trezor':
        devices.push(...trezorManager.getDevices());
        break;
      default:
        throw new Error(`Unknown device type: ${type}`);
    }

    this.logger.debug('found %s hardware devices', devices.length);
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

    assert(this.initialized === false, 'cannot initialize twice');

    try {
      switch (this.type) {
        case 'ledger': {
          const devices = await this.getDevices();
          const device = devices[0];

          this.device = new Device({
            device: device,
            timeout: HARDWARE_WALLET_TIMEOUT,
          });
          await this.device.open();
          this.app = new LedgerBcoin({ device: this.device });
          break;
        }

        case 'trezor': {
          const device = trezorManager.getDevice();
          if (!device) throw new Error('no trezor device detected');
          this.device = device;
          break;
        }

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
    switch (this.type) {
      case 'ledger':
        if (this.device) await this.device.close();
        break;
      default:
        break;
    }
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
      case 'ledger': {
        return await this.app.getPublicKey(path);
      }

      case 'trezor': {
        const p = parsePath(path, true);
        const result = await TrezorConnect.getPublicKey({
          path: p,
        });

        // throw trezor error message
        if (!result.success) throw new Error(result.payload.error);

        const hdpubkey = toHDPublicKey({
          type: 'options',
          depth: result.payload.depth,
          parentFingerPrint: result.payload.fingerprint,
          childIndex: result.payload.childNum,
          chainCode: Buffer.from(result.payload.chainCode, 'hex'),
          publicKey: Buffer.from(result.payload.publicKey, 'hex'),
          chain: this.chain,
          network: this.network,
        });

        return hdpubkey;
      }

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
  async getTransactionSignatures(tx, view, inputs, outputs) {
    assert(this.initialized, 'must initialize a hardware device');
    const unlock = await this.lock.lock();

    try {
      return await this._getTransactionSignatures(tx, view, inputs, outputs);
    } catch (e) {
      this.logger.error(e);
      this.logger.error(e.stack);
    } finally {
      unlock();
    }
  }

  async _getTransactionSignatures(tx, view, inputs, outputs) {
    switch (this.type) {
      case 'ledger':
        return await this.app.getTransactionSignatures(tx, view, inputs);

      case 'trezor': {
        // https://github.com/trezor/connect/blob/develop/docs/methods/signTransaction.md
        // for btc testnet, coin should be Testnet
        let coin = this.chain;
        if (this.network === 'testnet' && this.chain === 'bitcoin')
          coin = 'Testnet';

        const result = await TrezorConnect.signTransaction({
          inputs,
          outputs,
          coin,
          push: false,
        });

        if (!result.success) throw new Error(result.payload.error);
        return result.payload.signatures.map(s => Buffer.from(s, 'hex'));
      }

      default:
        return null;
    }
  }

  /**
   * Sign transaction with lock.
   * @param {bcoin.MTX} tx - mutable transaction
   * @param {LedgerTXInput[]|TrezorConnect.TransactionInput[]} inputs
   * @param {TrezorConnect.TransactionOutput[]} outputs
   * @returns {MTX} - signed mutable transaction
   * @throws {LedgerError}
   * @throws {AssertionError}
   */
  async signTransaction(tx, inputs, outputs) {
    assert(this.initialized, 'must initialize a hardware device');
    const unlock = await this.lock.lock();

    try {
      return await this._signTransaction(tx, inputs, outputs);
    } catch (e) {
      this.logger.error(e);
      this.logger.error(e.stack);
    } finally {
      unlock();
    }
  }

  async _signTransaction(tx, inputs, outputs) {
    switch (this.type) {
      case 'ledger':
        return await this.app.signTransaction(tx, inputs);

      case 'trezor': {
        // TODO: switch to TrezorConnect, since
        // the api is more simple and neither trezor.js
        // or TrezorConnect support bring your own tx
        // data
        const response = await this.device.waitForSessionAndRun(
          async session => {
            const result = await session.signTx(
              inputs,
              outputs,
              [], // txs
              this.chain // coin
            );
            return result;
          }
        );

        // TODO: turn into mtx here
        return response;
      }

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
