import { PLUGIN_NAMESPACE } from '../constants';
import bwallet from './bwallet';
import reduceNode from './node';
import reduceChain from './chain';
import { reduceInterface } from './interface';

module.exports = {
  [PLUGIN_NAMESPACE]: bwallet,
  reduceNode,
  reduceChain,
  reduceInterface,
};
