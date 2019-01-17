import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createNestedViews } from '@bpanel/bpanel-ui';
import { getClient } from '@bpanel/bpanel-utils';

import CreateNew from './CreateNew';
import SendReceive from './SendReceive';
import Overview from './Overview';
import WalletInfo from './WalletInfo';
import Welcome from './Welcome';
import MultisigFollowUp from './MultisigFollowUp';

import { mainContainer } from '../mappings';
import { metadata } from '../..';

function createWalletViews(match) {
  // these routes assume that the plugin metadata path
  // is /bwallet as Links elsewhere in the codebase use
  // /bwallet as the prefix to their paths
  // changing this will cause things to break
  const routes = [
    {
      path: `${match.url}/overview`,
      component: Overview,
    },
    {
      path: `${match.url}/send-receive`,
      component: SendReceive,
    },
    {
      path: `${match.url}/create`,
      component: CreateNew,
    },
    {
      path: `${match.url}/wallets/:type/:wallet`,
      component: WalletInfo,
    },
    {
      path: `${match.url}/multisig/:wallet/:action`,
      component: MultisigFollowUp,
    },
  ];

  return createNestedViews(routes, Welcome);
}

function createStaticSideNav(match) {
  return [
    {
      name: 'overview',
      displayName: 'Overview',
      pathName: `${match.url}/overview`,
      id: 'overview',
      order: 0,
      sidebar: true,
      parent: metadata.name,
      type: 'staticNav',
    },
    {
      name: 'create',
      displayName: 'Create New',
      pathName: `${match.url}/create`,
      id: 'create',
      order: 1,
      sidebar: true,
      parent: metadata.name,
      type: 'staticNav',
    },
    {
      name: 'send-receive',
      displayName: 'Send and Receive',
      pathName: `${match.url}/send-receive`,
      id: 'send-receive',
      order: 2,
      sidebar: true,
      parent: metadata.name,
      type: 'staticNav',
    },
  ];
}

class MainContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.client;
    const { match } = props;

    this.NestedViews = createWalletViews(match);
    this.staticSideNav = createStaticSideNav(match);
    this.resetSideNav = this.resetSideNav.bind(this);
  }

  static get propTypes() {
    return {
      match: PropTypes.object,
      getWallets: PropTypes.func,
      addSideNav: PropTypes.func,
      removeSideNav: PropTypes.func,
      walletsNavMeta: PropTypes.array,
      getWalletsInfo: PropTypes.func,
      history: PropTypes.object,
      walletSideNavMetadata: PropTypes.array,
      sideNav: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired,
          order: PropTypes.number.isRequired,
          parent: PropTypes.string.isRequired,
        })
      ),
    };
  }

  static get defaultProps() {
    return {};
  }

  resetSideNav() {
    const { history, removeSideNav, sideNav } = this.props;

    // redirect to the main page
    history.push(`/${metadata.pathName}`);

    for (const metadata of sideNav) {
      if (metadata.type !== 'staticNav') {
        removeSideNav(metadata);
      }
    }

    this.updateWallets();
  }

  async updateWallets() {
    const { getWallets, getWalletsInfo } = this.props;
    await getWallets('all');
    await getWalletsInfo();

    // build side nav
    this.updateSideNav();
  }

  // TODO: bug, on refresh, adds all wallets to wallets
  // even if they are multisig wallets
  async componentDidMount() {
    const { addSideNav } = this.props;

    // add static items to sidenav
    for (const metadata of this.staticSideNav) addSideNav(metadata);

    // get wallets for current client
    this.updateWallets();

    // setup listener for when client switches to update nav
    this.client = getClient();
    this.client.on('set clients', this.resetSideNav);
  }

  componentWillUnmount() {
    this.updateSideNav(true);
    this.client.removeListener('set clients', this.resetSideNav);
  }

  updateSideNav(remove = false) {
    const { walletsNavMeta, addSideNav, removeSideNav } = this.props;
    let action = addSideNav;
    const navItems = [...walletsNavMeta];
    if (remove) {
      action = removeSideNav;
      navItems.push(...this.staticSideNav);
    }
    for (const metadata of navItems) action(metadata);
  }

  render() {
    return <this.NestedViews match={this.props.match} />;
  }
}

export default connect(
  mainContainer.mapStateToProps,
  mainContainer.mapDispatchToProps
)(MainContainer);
