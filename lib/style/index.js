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
  hyperlink: { textDecoration: 'underline', color: 'lightblue', cursor: 'pointer' }
};

export {
  selectStep,
  importWallet,
};
