// TODO: handshake compatibility
const { MTX, Network } = require('bcoin');
const { common } = require('bcoin/lib/hd');
const assert = require('bsert');

// TODO: polymorphic account? string or int
// assertion around size of account
function renderxpubAccount(account, network) {
  const n = network.get(network);
  const coinType = n.keyPrefix.coinType;
  const prefix = `m/44'/${coinType}'`
  return `${prefix}/${account}'`
};

async function createSignature(hwApp, ptx, xpubAccount, enc) {
  const { tx, scripts, paths } = ptx;
  assert(tx, 'requires proposal tx txn');
  assert(scripts, 'requires proposal tx scripts')
  assert(paths, 'requires proposal tx paths');

  const inputCount = mtx.inputs.length;
  assert(inputCount === scripts.length, 'must have one script for each input');
  assert(inputCount === paths.length, 'must have one path for each input');

  assert(common.isAccount(xpubAccount), 'must be a bip44 account');

  const mtx = MTX.fromJSON(ptx);

  const ledgerInputs = [];
  for (const [i, input] of mtx.inputs.entries()) {
    const { branch, index } = paths[i];
    const path = `${xpubAccount}/${branch}/${index}`;
    const redeem = Buffer.from(scripts[i]);
    const coin = mtx.view.getCoinFor(input);

    const ledgerInput = new LedgerInput({ witness: true, redeem, coin, path });
    ledgerInputs.push(ledgerInput);
  }

  const signatures = await hwApp.getTransactionSignatures(mtx, mtx.view, ledgerInputs);

  if (enc === 'hex')
    return signatures.map(s => s.toString('hex'));

  return signatures;
}

module.exports = {
  createSignature,
  renderxpubAccount,
};
