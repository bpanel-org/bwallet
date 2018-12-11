import assert from 'bsert';
import { MTX as bcoinMTX, TX as bcoinTX, KeyRing as bcoinKeyRing, Address as bcoinAddress } from 'bcoin';
import { MTX as bcashMTX, TX as bcashTX, KeyRing as bcashKeyRing, Address as bcashAddress } from 'bcash';
import { MTX as hsdMTX, TX as hsdTX, KeyRing as hsdKeyRing, Address as hsdAddress } from 'hsd';

const MTX = {
  bitcoin: bcoinMTX,
  bitcoincash: bcashMTX,
  handshake: hsdMTX,
};

const TX = {
  bitcoin: bcoinTX,
  bitcoincash: bcashTX,
  handshake: hsdTX,
};

const Address = {
  bitcoin: bcoinAddress,
  bitcoincash: bcashAddress,
  handshake: hsdAddress,
};

const KeyRing = {
  bitcoin: bcoinKeyRing,
  bitcoincash: bcashKeyRing,
  handshake: hsdKeyRing,
};

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
      return Address[chain].fromString(address, network);

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
      return KeyRing[chain].fromPublic(key, network);

    case 'private':
      return KeyRing[chain].fromPrivate(key, compress);

    case 'options':
      return KeyRing[chain].fromOptions(options);

    default:
      return null;
  }
}
