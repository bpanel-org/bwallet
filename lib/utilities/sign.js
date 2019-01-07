// This file is meant to work with node.js
// TODO: handshake compatibility
const { MTX } = require('bcoin');
const { LedgerTXInput } = require('bledger');
const assert = require('bsert');
const { parsePath } = require('./path');

/*
 * @param {Object} hwApp
 * @param {Object} ptx - proposal transaction
 * @param {String} account - bip44 account
 * @param {String} enc - return signature in hex
 */
async function hardwareSignatures(hwApp, ptx, account, enc) {
  const { tx, scripts, paths } = ptx;
  assert(tx, 'requires proposal tx txn');
  assert(scripts, 'requires proposal tx scripts');
  assert(paths, 'requires proposal tx paths');

  const inputCount = tx.inputs.length;
  assert(inputCount === scripts.length, 'must have one script for each input');
  assert(inputCount === paths.length, 'must have one path for each input');

  const mtx = MTX.fromJSON(tx);
  const ledgerInputs = [];

  for (const [i, input] of mtx.inputs.entries()) {
    const { branch, index } = paths[i];
    const path = `${account}/${branch}/${index}`;
    const redeem = Buffer.from(scripts[i]);
    const coin = mtx.view.getCoinFor(input);
    const ledgerInput = new LedgerTXInput({
      witness: true,
      redeem,
      coin,
      path,
    });
    ledgerInputs.push(ledgerInput);
  }

  const signatures = await hwApp.getTransactionSignatures(
    mtx,
    mtx.view,
    ledgerInputs
  );

  if (enc === 'hex') return signatures.map(s => s.toString('hex'));

  return signatures;
}

/*
 * build the ledgerInputs for legacy tx signing
 * and then sign the transaction
 *
 * @param {Object}     hwApp  - ledger app instance
 * @param {bcoin.MTX}  mtx    - transaction to sign
 * @param {[]bcoin.TX} inputs - list of input TXs
 * @param {[]String}   paths  - return signature in hex
 */
async function hardwareTransaction(hwApp, mtx, inputs, paths) {
  switch (hwApp.type) {
    case 'ledger': {
      const ledgerInputs = [];
      for (const [i, input] of mtx.inputs.entries()) {
        const li = new LedgerTXInput({
          tx: inputs[i].toRaw(),
          index: input.prevout.index,
          path: paths[i],
          witness: inputs[i].hasWitness(),
        });
        ledgerInputs.push(li);
      }

      await hwApp.signTransaction(mtx, ledgerInputs);

      return mtx;
    }
    case 'trezor': {
      // TrezorConnect uses their backend to fetch
      // transaction data, it doesn't "just sign"
      // Build data structure for trezor.js, which
      // will be deprecated at some point in the future
      // TODO: determine if TrezorConnect works
      // with SPENDMULTISIG

      // data structures for session.signTX
      const trezorInputs = [];

      for (const [i, input] of mtx.inputs.entries()) {
        const path = parsePath(paths[i], true);
        let ti = {
          address_n: path,
          prev_hash: input.prevout.hash.toString('hex'),
          prev_index: input.prevout.index,
          sequence: input.sequence,
          // default to normal spend
          script_type: 'SPENDADDRESS',
          amount: inputs[i].outputs[input.prevout.index].value,
        };

        // alter if its multisig
        if (input.script.isMultisig()) {
          ti.script_type = 'SPENDMULTISIG';
          // TODO: use mtx to get pubkeys
          // see https://gist.github.com/chjj/1f740a9dd29c7b625febc89a88fdf236
          ti.multisig = {
            pubkeys: [],
          };
        }

        trezorInputs.push(ti);
      }

      const trezorOutputs = [];
      for (const output of mtx.outputs) {
        // TODO: bech32/base58?
        const address = output.getAddress().toBase58();
        const to = {
          address,
          amount: output.value.toString(10),
          // TODO: allow for other types
          script_type: 'PAYTOADDRESS',
        }
        trezorOutputs.push(to);
      }

      const result = await hwApp.signTransaction(mtx, trezorInputs, trezorOutputs);

      return result;
    }

    default:
      throw new Error(`bad hardware type: ${hwApp.type}`)
  }
}

module.exports = {
  hardwareSignatures,
  hardwareTransaction,
};
