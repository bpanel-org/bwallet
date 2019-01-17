import { resetApp } from '../actions';

export default function middleware(store) {
  return next => async action => {
    const { dispatch } = store;

    if (action.type === 'STATE_REFRESHED') {
      // reset the entire bwallet store
      dispatch(resetApp());
    }

    next(action);
  };
}
