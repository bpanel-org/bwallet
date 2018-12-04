/*
 * styles
 */

const viewButton = {
  base: {
    borderStyle: 'solid',
    cursor: 'pointer',
    padding: '2rem',
    margin: '2rem',
  },
  disabled: {
    cursor: 'not-allowed',
    opacity: '0.5',
    userSelect: 'none',
  },
  text: {
    textAlign: 'center',
  },
  icon: {
    fontSize: '4rem',
  },
};

const multisigComplete = {
  secretText: {
    borderStyle: 'solid',
    padding: '0.3rem',
  },
};

export { viewButton, multisigComplete };
