import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createNestedViews } from '@bpanel/bpanel-ui';

import CreateNew from './CreateNew';
import SendReceive from './SendReceive';
import Overview from './Overview';

import { mainContainer } from '../mappings';

class MainContainer extends PureComponent {
  constructor(props) {
    super(props);

    // TODO: add static side bar navs
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

  async componentDidMount() {
    const {
      getWallets,
      getWalletsInfo,
    } = this.props;

    await getWallets();
    await getWalletsInfo();

    // build side nav
    this.walletsSideNav();
  }

  walletsSideNav() {
    const { walletSideNavMetadata, addSideNav } = this.props;
    console.log(walletSideNavMetadata);

    for (const metadata of walletSideNavMetadata)
      addSideNav(metadata);
  }

  render() {
    const { match } = this.props;

    // TODO: figure out how to get subitems on sidebar to work
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
    ];
    const NestedViews = createNestedViews(routes);

    // TODO: temporary just render one
    return (
      <div>
        <CreateNew />
        <Overview />
        <SendReceive />
      </div>
    );
  }
}

export default connect(
  mainContainer.mapStateToProps,
  mainContainer.mapDispatchToProps
)(MainContainer);
