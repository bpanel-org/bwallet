import { PLUGIN_NAMESPACE } from '../constants';
import bwallet from './bwallet';
import reduceNode from './node';
import reduceChain from './chain';
import reduceWallet from './wallet';
import { reduceInterface } from './interface';

module.exports = {
  [PLUGIN_NAMESPACE]: bwallet,
  reduceNode,
  reduceChain,
  reduceWallet,
  reduceInterface,
};
