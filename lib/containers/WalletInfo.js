import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Text } from '@bpanel/bpanel-ui';

import { walletInfo } from '../mappings';

class WalletInfo extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { selectWallet, selectedWallet, match } = this.props;

    /*
     * depends on uri schema:
     * /bwallet/wallets/:type/:wallet
     */
    const { params } = match;
    const { type, wallet } = params;

    // only select wallet if it has yet to be selected
    // this prevents an infinite loop
    if (selectedWallet !== wallet) selectWallet(wallet, type);
  }

  static get propTypes() {
    return {
      match: PropTypes.object.isRequired,
      selectWallet: PropTypes.func,
      selectedWallet: PropTypes.string,
    };
  }

  render() {
    const { selectedWallet } = this.props;

    return (
      <div>
        <Text>{selectedWallet}</Text>
      </div>
    );
  }
}

export default connect(
  walletInfo.mapStateToProps,
  walletInfo.mapDispatchToProps
)(WalletInfo);
