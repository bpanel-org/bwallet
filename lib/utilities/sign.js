// This file is meant to work with node.js
// TODO: handshake compatibility
const { MTX } = require('bcoin');
const { LedgerTXInput } = require('bledger');
const assert = require('bsert');

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

// inputs - list of hex buffers
// bcoin.MTX will not work because
// instanceof issues
async function hardwareTransaction(hwApp, mtx, inputs, paths) {
  const ledgerInputs = [];
  for (const [i, input] of mtx.inputs.entries()) {
    const li = new LedgerTXInput({
      tx: inputs[i],
      index: input.prevout.index,
      path: paths[i],
    });
    ledgerInputs.push(li);
  }

  await hwApp.signTransaction(mtx, ledgerInputs);

  return mtx;
}

module.exports = {
  hardwareSignatures,
  hardwareTransaction,
};
