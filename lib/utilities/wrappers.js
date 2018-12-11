import assert from 'bsert';

// TODO: bitcoincash import doesn't work?
const MTX = {
  bitcoin: require('bcoin/lib/primitives/mtx'),
  bitcoincash: require('bcash').MTX,
  handshake: require('hsd/lib/primitives/mtx'),
};

const TX = {
  bitcoin: require('bcoin/lib/primitives/tx'),
  bitcoincash: require('bcash').TX,
  handshake: require('hsd/lib/primitives/tx'),
};

const Address = {
  bitcoin: require('bcoin/lib/primitives/address'),
  bitcoincash: require('bcash').Address,
  handshake: require('hsd/lib/primitives/address'),
}

const KeyRing = {
  bitcoin: require('bcoin/lib/primitives/keyring'),
  bitcoincash: require('bcash').KeyRing,
  handshake: require('hsd/lib/primitives/keyring'),
}

export function toMTX(tx, options) {
  const { type, chain } = options;
  assert(type);
  assert(chain);

  switch (type) {
    case 'raw':
      return MTX[chain].fromRaw(tx.hex, 'hex');

    case 'json':
      return MTX[chain].fromJSON(tx);

    default:
      return null;
  }
}

export function toTX(tx, options) {
  const { type, chain } = options;
  assert(type);
  assert(chain);

  switch (type) {
    case 'raw':
      return TX[chain].fromRaw(tx.hex, 'hex');

    case 'json':
      return TX[chain].fromJSON(tx);

    case 'options':
      return TX[chain].fromOptions(tx);

    default:
      return null;
  }
}

export function toAddress(address, options) {
  const { type, chain, network } = options;

  switch (type) {
    case 'string':
      return Address[chain].fromString(address, network)

    case 'options':
      return Address[chain].fromOptions(options);

    default:
      return null;
  }
}

export function toKeyRing(key, options) {
  const { type, chain, network, compress } = options;

  switch (type) {
    case 'public':
      return KeyRing[chain].fromPublic(address, network)

    case 'private':
      return KeyRing[chain].fromPrivate(key, compress);

    case 'options':
      return KeyRing[chain].fromOptions(options);

    default:
      return null;
  }
}
