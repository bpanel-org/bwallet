import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createNestedViews } from '@bpanel/bpanel-ui';

import CreateNew from './CreateNew';
import SendReceive from './SendReceive';
import Overview from './Overview';
import WalletInfo from './WalletInfo';
import Welcome from './Welcome';

import { mainContainer } from '../mappings';

class MainContainer extends PureComponent {
  constructor(props) {
    super(props);

    // TODO: need to make sure to call only once
    // and that the side bar items are properly sorted
    this.staticSideNav();
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

  // TODO: bug, on refresh, adds all wallets to wallets
  // even if they are multisig wallets
  async componentDidMount() {
    const { getWallets, getWalletsInfo } = this.props;

    await getWallets('all');
    await getWalletsInfo();

    // build side nav
    this.walletsSideNav();
  }

  staticSideNav() {
    const { addSideNav, match } = this.props;

    // TODO: don't hardcode this here, import as function
    // so that there can be a single source of truth
    const sideNav = [
      {
        name: 'overview',
        displayName: 'Overview',
        pathName: `${match.url}/overview`,
        id: 'overview',
        sidebar: true,
      },
      {
        name: 'send-receive',
        displayName: 'Send and Receive',
        pathName: `${match.url}/send-receive`,
        id: 'send-receive',
        sidebar: true,
      },
      {
        name: 'create',
        displayName: 'Create New',
        pathName: `${match.url}/create`,
        id: 'create',
        sidebar: true,
      },
    ];

    for (const nav of sideNav) addSideNav(nav);
  }

  walletsSideNav() {
    const { walletsNavMeta, addSideNav } = this.props;
    for (const metadata of walletsNavMeta) addSideNav(metadata);
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
    ];
    const NestedViews = createNestedViews(routes);

    let render;
    if (match.isExact) render = <Welcome />;
    else render = <NestedViews />;

    return <div>{render}</div>;
  }
}

export default connect(
  mainContainer.mapStateToProps,
  mainContainer.mapDispatchToProps
)(MainContainer);
