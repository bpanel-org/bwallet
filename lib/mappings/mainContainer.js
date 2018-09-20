import { selectWalletInfo, selectWallets } from './selectors';
import {
  getWalletInfo,
  addSideNav,
  getWallets,
  getWalletsInfo,
} from '../actions';
import { helpers } from '@bpanel/bpanel-utils';

// TODO: turn bwallet into constant here
function buildWalletMetadata(walletInfo) {
  return Object.values(walletInfo).map(wallet => ({
    name: wallet.id,
    displayName: wallet.id,
    pathName: `bwallet/wallets/${wallet.id}`,
    id: helpers.getHash(wallet, 'sha256'),
    sidebar: true,
    icon: 'fa-money', // TODO: use valid icon
  }));
}

function mapStateToProps(state, otherProps) {
  const wallets = selectWallets(state);
  const walletInfo = selectWalletInfo(state);

  // TODO: need to filter out ones that have already been added
  // create selector for nav, get the set difference
  const walletSideNavMetadata = buildWalletMetadata(walletInfo);

  return {
    wallets,
    walletSideNavMetadata,
    ...otherProps,
  };
}

// TODO: be certain we need selectAccount and selectWallet
function mapDispatchToProps(dispatch) {
  return {
    getWallets: type => dispatch(getWallets(type)),
    addSideNav: metadata => dispatch(addSideNav(metadata)),
    getWalletInfo: walletId => dispatch(getWalletInfo(walletId)),
    getWalletsInfo: walletIds => dispatch(getWalletsInfo(walletIds)),
  };
}

export default {
  mapStateToProps,
  mapDispatchToProps,
};
