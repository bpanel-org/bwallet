// This file is meant to work with node.js
// TODO: add babel-runtime so that import syntax
// can be used
// TODO: handshake compatibility
const { LedgerTXInput } = require('bledger');
const assert = require('bsert');
const { parsePath } = require('./path');

/*
 * @param {Object} hwApp
 * @param {Object} ptx - proposal transaction
 * @param {String} account - bip44 account
 * @param {String} enc - return signature in hex
 *
 * TODO: list of accounts if all are not from the
 * same account?
 */
async function hardwareSignatures(
  hwApp,
  ptx,
  account,
  pubkeys,
  enc,
  network = 'main'
) {
  const { tx, scripts, paths } = ptx;
  assert(tx, 'requires proposal tx txn');
  assert(scripts, 'requires proposal tx scripts');
  assert(paths, 'requires proposal tx paths');

  const inputCount = tx.inputs.length;
  assert(inputCount === scripts.length, 'must have one script for each input');
  assert(inputCount === paths.length, 'must have one path for each input');

  const mtx = tx;
  const inputs = [];
  const outputs = [];

  switch (hwApp.type) {
    case 'ledger':
      {
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
          inputs.push(ledgerInput);
        }
      }
      break;

    case 'trezor':
      {
        let segwit;
        for (const [i, input] of mtx.inputs.entries()) {
          const { branch, index } = paths[i];
          const path = `${account}/${branch}/${index}`;
					hwApp.logger.debug('using path %s', path);

          let amount;
          const inputCoin = mtx.view.getCoin(input.prevout);
          if (inputCoin) amount = inputCoin.value.toString();

          let ti = {
            address_n: parsePath(path, true),
            prev_index: input.prevout.index,
            prev_hash: input.prevout.txid(),
            script_type: 'SPENDADDRESS',
            amount,
          };

          segwit = false;
          if (input.getAddress().isProgram()) segwit = true;

          // TODO: set script type
          // https://github.com/trezor/trezor-common/blob/60f43b2db31e3eac1da7f483e13773a1a61bd431/protob/messages-bitcoin.proto
          // use bcoin.Address.types mapping
          // Address.getType

          // check if input is multisig
          let m, n;
          if (segwit) [m, n] = input.witness.getRedeem().getMultisig();
          else [m, n] = input.script.getMultisig();

          if (n !== -1) {
            ti.script_type = 'SPENDMULTISIG';

            if (segwit) ti.script_type = 'SPENDWITNESS';

            const sorted = pubkeys.slice().sort((a, b) => {
              const k1 = a.derive(branch).derive(index);
              const k2 = b.derive(branch).derive(index);
              return k1.publicKey.compare(k2.publicKey);
            });

            ti.multisig = {
              pubkeys: sorted.map(key => ({
                node: {
                  depth: key.depth,
                  child_num: key.childIndex,
                  fingerprint: key.parentFingerPrint,
                  public_key: key.publicKey.toString('hex'),
                  chain_code: key.chainCode.toString('hex'),
                },
                address_n: [branch, index],
              })),
              signatures: pubkeys.map(() => ''),
              m: m,
            };
          }
          inputs.push(ti);
        }
        for (const [, output] of mtx.outputs.entries()) {
          let address;
          if (segwit) address = output.getAddress().toBech32(network);
          else address = output.getAddress().toBase58(network);
          const amount = output.value.toString();
          outputs.push({
            address,
            amount,
            script_type: 'PAYTOADDRESS',
          });
        }
      }
      break;
  }

  const signatures = await hwApp.getTransactionSignatures(
    mtx,
    mtx.view,
    inputs,
    outputs
  );

  if (!signatures) throw new Error('bad transaction signing');

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
        };
        trezorOutputs.push(to);
      }

      const result = await hwApp.signTransaction(
        mtx,
        trezorInputs,
        trezorOutputs
      );

      return result;
    }

    default:
      throw new Error(`bad hardware type: ${hwApp.type}`);
  }
}

module.exports = {
  hardwareSignatures,
  hardwareTransaction,
};
