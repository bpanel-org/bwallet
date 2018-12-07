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

class MainContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.client;
    const { match } = props;
    this.staticSideNav = [
      {
        name: 'overview',
        displayName: 'Overview',
        pathName: `${match.url}/overview`,
        id: 'overview',
        order: 0,
        sidebar: true,
        parent: metadata.name,
      },
      {
        name: 'create',
        displayName: 'Create New',
        pathName: `${match.url}/create`,
        id: 'create',
        order: 1,
        sidebar: true,
        parent: metadata.name,
      },
      {
        name: 'send-receive',
        displayName: 'Send and Receive',
        pathName: `${match.url}/send-receive`,
        id: 'send-receive',
        order: 2,
        sidebar: true,
        parent: metadata.name,
      },
    ];
  }

  static get propTypes() {
    return {
      getWallets: PropTypes.func,
      walletSideNavMetadata: PropTypes.array,
    };
  }

  static get defaultProps() {
    return {};
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
    this.client = getClient();
    this.updateWallets();
    this.client.on('set clients', () => this.updateWallets());
  }

  componentWillUnmount() {
    this.updateSideNav(true);
    this.client.removeListener('set clients', () => this.updateWallets());
  }

  updateSideNav(remove = false) {
    const { walletsNavMeta, addSideNav, removeSideNav } = this.props;
    let action = addSideNav;
    if (remove) action = removeSideNav;
    const navItems = [...this.staticSideNav, ...walletsNavMeta];
    for (const metadata of navItems) action(metadata);
  }

  render() {
    // these routes assume that the plugin metadata path
    // is /bpanel as Links elsewhere in the codebase use
    // /bpanel as the prefix to their paths
    // changing this will cause things to break
    const { match } = this.props;

    // TODO: keep one source of truth for routes route side nav
    const routes = [
      {
        path: `${match.url}/overview`,
        component: props => <Overview {...props} />,
      },
      {
        path: `${match.url}/send-receive`,
        component: props => <SendReceive {...props} />,
      },
      {
        path: `${match.url}/create`,
        component: props => <CreateNew {...props} />,
      },
      {
        path: `${match.url}/wallets/:type/:wallet`,
        component: props => <WalletInfo {...props} />,
      },
      {
        path: `${match.url}/multisig/:wallet/:action`,
        component: props => <MultisigFollowUp {...props} />,
      },
    ];
    const NestedViews = createNestedViews(routes);

    let render;
    if (match.isExact) render = <Welcome />;
    else render = <NestedViews />;

    return render;
  }
}

export default connect(
  mainContainer.mapStateToProps,
  mainContainer.mapDispatchToProps
)(MainContainer);
