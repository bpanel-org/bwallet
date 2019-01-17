import { resetApp, removeSideNav, getWallets, getWalletsInfo } from '../actions';
import { selectWallets, selectMultisigWallets } from '../mappings/selectors';

export default function middleware(store) {
  return next => async (action = {} )=> {
    const { dispatch, getState } = store;

    if (action.type === 'STATE_REFRESHED') {
      // reset the entire bwallet store
      dispatch(resetApp());
    }

    next(action);
  }
};
