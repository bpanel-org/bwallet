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
  }

  static get propTypes() {
    return {
      selectAccount: PropTypes.func,
      selectWallet: PropTypes.func,
      selectedWallet: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      selectedWallet: null,
    };
  }

  componentDidMount() {
    const { selectAccount, selectedWallet, selectWallet } = this.props;
    // NOTE: magic variables, select default wallet and account
    // when first rendering the plugin, primary and default are
    // hardcoded into bcoin like blockchains
    if (selectedWallet == null) {
      selectWallet('primary');
      selectAccount('primary', 'default');
    }
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
        <Overview />
        <SendReceive />
        <CreateNew />
      </div>
    );
  }
}

export default connect(
  mainContainer.mapStateToProps,
  mainContainer.mapDispatchToProps
)(MainContainer);
