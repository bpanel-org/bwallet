/*
 * styles
 */

const selectStep = {
  container: { justifyContent: 'space-around' },
  icon: { margin: 'auto', fontSize: '4rem' },
  iconContainer: { padding: '1.25rem' },
  rowContainer: { justifyContent: 'center' },
  itemContainer: { padding: '4rem', borderStyle: 'solid', cursor: 'pointer' },
  disabled: { cursor: 'not-allowed', opacity: '0.5', userSelect: 'none' },
};

const importWallet = {
  hyperlink: {
    textDecoration: 'underline',
    color: 'lightblue',
    cursor: 'pointer',
  },
};

const multisigFollowUp = {
  rowItem: { justifyContent: 'center', margin: 'auto', padding: '1rem' },
  secretItem: { justifyContent: 'space-evenly', margin: 'auto', padding: '1rem'  },
  secretLabel: { padding: '0.3rem' },
  secretValue: { padding: '0.3rem', borderStyle: 'solid' },
  rightPad: { paddingRight: '2rem' },
}

export { selectStep, importWallet, multisigFollowUp };
