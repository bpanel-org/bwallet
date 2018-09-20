import { combineReducers } from 'redux';

import reduceApp from './app';
import reduceWallets from './wallet';
import reduceInterface from './interface';

import {
  REDUCE_INTERFACE_NAMESPACE,
  REDUCE_WALLETS_NAMESPACE,
  REDUCE_APP_NAMESPACE,
} from '../constants';

module.exports = combineReducers({
  [REDUCE_APP_NAMESPACE]: reduceApp,
  [REDUCE_WALLETS_NAMESPACE]: reduceWallets,
  [REDUCE_INTERFACE_NAMESPACE]: reduceInterface,
});
