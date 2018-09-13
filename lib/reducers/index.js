import { combineReducers } from 'redux'

import reduceApp from './app';
import reduceNode from './node';
import reduceWallets from './wallet';
import reduceInterface from './interface';

import {
  REDUCE_INTERFACE_NAMESPACE,
  REDUCE_NODE_NAMESPACE,
  REDUCE_WALLETS_NAMESPACE,
  REDUCE_APP_NAMESPACE,
} from '../constants';

module.exports = combineReducers({
  [REDUCE_APP_NAMESPACE]: reduceApp,
  [REDUCE_NODE_NAMESPACE]: reduceNode,
  [REDUCE_WALLETS_NAMESPACE]: reduceWallets,
  [REDUCE_INTERFACE_NAMESPACE]: reduceInterface,
});
