/*
 * styles
 */

function getCardStyles(themeColors) {
  return {
    card: {
      borderStyle: 'solid',
      cursor: 'pointer',
      borderRadius: 0,
    },
    disabled: {
      cursor: 'not-allowed',
      opacity: '0.5',
      userSelect: 'none',
    },
    text: {
      textAlign: 'center',
    },
    body: {
      backgroundColor: themeColors.lowlight2,
    },
    footer: {
      backgroundColor: themeColors.highlight2,
      borderRadius: 0,
    },
  };
}

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

export { getCardStyles, viewButton, multisigComplete };
