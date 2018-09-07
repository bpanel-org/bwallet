// sign transaction

import { Script, Outpoint, TX, MTX, Coin } from 'bcoin';
import { LedgerBcoin, U2F, LedgerTXInput } from 'bledger/lib/bledger-browser';
const { Device } = U2F;

const blgr = require('blgr');

const { HARDWARE_WALLET_TIMEOUT } = require('../constants');

/**
 * Initializes and returns a new Device
 * NOTE: caller must call device.close when done
 * @returns {Device}
 */
async function newDevice(timeout = LEDGER_TIMEOUT) {
  try {
    const devices = await Device.getDevices();
    const device = new Device({
      device: devices[0],
      timeout: HARDWARE_WALLET_TIMEOUT,
    });
    return device;
  } catch (e) {
    throw e;
  }
}

/**
 * Initializes and returns a new LedgerBcoin
 * @returns {LedgerBcoin}
 */
export const newLedgerBcoin = async () => {
  try {
    const device = await newDevice();
    const ledgerBcoin = new LedgerBcoin({ device });

    // return device so that it can be closed
    return { device, ledgerBcoin };
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * Get public key from an application by path
 * @param {btcApp} - an instance of a key manager like LedgerBcoin
 * @param {path} - bip 44 path
 */
export const getPublicKey = async (btcApp, path) => {
  try {
    return await btcApp.getPublicKey(path);
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * Get BIP 44 path by account
 * @param {account} - a BIP 44 account integer
 * @returns {path} - bip 44 path
 */
// TODO: be flexible for testnet ( m/44'/1'/0 )
export const buildXpubPath = account => `m/44'/0'/${account}'`;

// TODO: clean up arguments
export const signTX = async (
  bcoinApp,
  client,
  accountPath,
  proposalMTX,
  walletId
) => {
  const { tx, scripts, paths } = proposalMTX;
  const redeem = Buffer.from(scripts[0].data);
  const mtx = MTX.fromJSON(tx);

  console.assert(paths.length === tx.inputs.length, '');

  const ledgerInputs = [];
  for (let i = 0; i < mtx.inputs.length; i++) {
    const c = mtx.inputs[i].toJSON();
    const { hash, index } = c.prevout;

    const txDetails = await client.getTX(walletId, hash);

    const transaction = Buffer.from(txDetails.tx, 'hex');

    const path = paths[i];
    const { branch, index: pathIndex } = path;

    const fullPath = `${accountPath}/${branch}/${pathIndex}`;

    let input = new LedgerTXInput({
      tx: transaction,
      witness: true,
      index: index, // output index in transaction
      redeem: redeem,
      path: fullPath,
    });
    ledgerInputs.push(input);
  }

  await bcoinApp.signTransaction(mtx, ledgerInputs);
  console.log(`MTX verify: ${mtx.verify()}`);
  return mtx;
};
