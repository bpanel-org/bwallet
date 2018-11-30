/*
 * application wide constants
 */

export const USER_SELECT_XPUB = 'USER_SELECT_XPUB';
export const USER_SELECT_WALLET = 'USER_SELECT_WALLET';
export const USER_SELECT_MULTISIG_PROPOSAL = 'USER_SELECT_MULTISIG_PROPOSAL';
export const USER_SELECT_ACCOUNT = 'USER_SELECT_ACCOUNT';
export const USER_SELECT_MULTISIG_WALLET = 'USER_SELECT_MULTISIG_WALLET';
export const UPDATE_TEXT_FIELD = 'UPDATE_TEXT_FIELD';

// headers being used on Overview page
export const OVERVIEW_LIST_HEADERS = [
  'Name',
  'Balance',
  'Watch Only',
  'Multi-Party',
];
export const OVERVIEW_MP_LIST_HEADERS = ['Name', 'Date', 'M of N', 'Init'];

export const WALLET_INFO_ACCOUNTS_LIST_HEADERS = [
  'Name',
  'Balance',
  'Address',
  'Watch Only',
];

export const WALLET_INFO_PENDING_MULTISIG_LIST_HEADERS = [
  'Name',
  'Created',
  'Amount',
  'Progress',
  'Destination',
  'Rate',
  'Rejections',
  'Select',
];

const basePath = 'bwallet';
export const BASE_PATH = basePath;
export const MULTISIG_ACTION_PATH = `${basePath}/multisig/:wallet/:action`;

export const pathBuilder = {
  multisigAction: (wallet, action) => `multisig/${wallet}/${action}`,
};

export const HARDWARE_TYPES = ['ledger'];
