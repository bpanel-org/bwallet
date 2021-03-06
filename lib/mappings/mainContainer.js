import { helpers } from '@bpanel/bpanel-utils';
import { createSelector } from 'reselect';
import {
  selectWalletInfo,
  selectWallets,
  selectMultisigWalletInfo,
  selectMultisigWallets,
} from './selectors';

import {
  addSideNav,
  clearWallets,
  removeSideNav,
  getWallets,
  getWalletsInfo,
} from '../actions';

import { PLUGIN_NAMESPACE } from '../constants';

const getSideNav = state => state.nav.sidebar;
const walletSideNav = createSelector(
  getSideNav,
  navItems => navItems.filter(item => item.parent === PLUGIN_NAMESPACE)
);

// TODO: turn bwallet into constant here
function sideMeta(info, type) {
  let icon;
  if (type === 'standard') icon = 'user';
  else icon = 'users';
  return Object.values(info).map(wallet => {
    // handle @bpanel/simple-wallet collision
    if (!wallet) {
      return {};
    }
    return {
      name: wallet.id,
      displayName: wallet.id,
      pathName: `/bwallet/wallets/${type}/${wallet.id}`,
      id: helpers.getHash(wallet, 'SHA256'),
      parent: require('../..').metadata.name,
      order: 3,
      sidebar: true,
      icon,
    };
  });
}

function mapStateToProps(state, otherProps) {
  const wallets = selectWallets(state);
  const multisigWallets = selectMultisigWallets(state);
  const walletInfo = selectWalletInfo(state);
  const multisigInfo = selectMultisigWalletInfo(state);

  // TODO: need to filter out ones that have already been added
  // create selector for nav, get the set difference
  const walletsNavMeta = [
    ...sideMeta(walletInfo, 'standard'),
    ...sideMeta(multisigInfo, 'multisig'),
  ];

  return {
    sideNav: walletSideNav(state),
    wallets,
    multisigWallets,
    walletsNavMeta,
    ...otherProps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getWallets: type => dispatch(getWallets(type)),
    addSideNav: metadata => dispatch(addSideNav(metadata)),
    clearWallets: () => dispatch(clearWallets()),
    removeSideNav: metadata => dispatch(removeSideNav(metadata)),
    getWalletsInfo: () => dispatch(getWalletsInfo()),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
