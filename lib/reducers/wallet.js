/*
 * bwallet blockchain wallet reducer
 * maintains information specific to a
 * blockchain node
 */

const initialState = {};

export default function reduceWallet(state = initialState, action) {
  // eslint-disable-next-line no-unused-vars
  const { type, payload } = action;

  switch (type) {

    default:
      return state;
  }
}

