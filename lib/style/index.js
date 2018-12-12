/*
 * styles
 */

import { utils } from '@bpanel/bpanel-ui';
const { makeRem } = utils;

function getCardStyles({ themeColors, border2, fontSizeBase, rawRem }) {
  return {
    card: {
      cursor: 'pointer',
      borderRadius: 0,
    },
    title: {
      textTransform: 'capitalize',
      marginBottom: 0,
    },
    disabled: {
      cursor: 'not-allowed',
      opacity: '0.5',
      userSelect: 'none',
    },
    body: {
      backgroundColor: themeColors.lowlight2,
      textAlign: 'center',
      position: 'relative',
    },
    balance: {
      fontSize: makeRem(rawRem.fontSizeSmall),
      color: themeColors.highlight1,
    },
    type: {},
    addNew: {
      backgroundColor: themeColors.transparent,
      border: border2,
      padding: makeRem(1.5, fontSizeBase),
      borderWidth: '6px',
      textTransform: 'uppercase',
      color: themeColors.light2Bg,
      textAlign: 'center',
    },
    textFooter: {
      position: 'absolute',
      width: '100%',
      marginBottom: makeRem(rawRem.fontSizeSmall),
      bottom: 0,
      left: 0,
      fontSize: makeRem(rawRem.fontSizeSmall),
      textTransform: 'uppercase',
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
