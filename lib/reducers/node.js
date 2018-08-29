/*
 * bwallet blockchain node reducer
 * maintains information specific to a
 * blockchain node
 */

const initialState = {};

export default function reduceNode(state = initialState, action) {
  // eslint-disable-next-line no-unused-vars
  const { type, payload } = action;

  switch (type) {
    default:
      return state;
  }
}
