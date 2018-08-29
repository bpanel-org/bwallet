/*
 * bwallet plugin-wide reducer
 * maintain shared state for this plugin
 */

const initialState = {};

export default function bwalletReducer(state = initialState, action) {
  // eslint-disable-next-line no-unused-vars
  const { type, payload } = action;

  switch (type) {
    default:
      return state;
  }
}
