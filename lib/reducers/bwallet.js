/*
 * bwallet plugin-wide reducer
 * maintain shared state for this plugin
 */

const initialState = {};

export default function bwalletReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    default:
      return state;
  }
}
