import { clearAllWallets } from './actions';

export function middleware(store) {
  return next => async action => {
    const { dispatch } = store;

    if (action.type === 'STATE_REFRESHED') {
      // reset the entire bwallet store
      dispatch(clearAllWallets());
    }

    next(action);
  };
}
