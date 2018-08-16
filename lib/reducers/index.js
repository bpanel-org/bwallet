import { PLUGIN_NAMESPACE } from '../constants';
import bwallet from './bwallet';
import reduceNode from './node';
import reduceChain from './chain';

export default {
  [PLUGIN_NAMESPACE]: bwallet,
  reduceNode,
  reduceChain,
};

