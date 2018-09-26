import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Text } from '@bpanel/bpanel-ui';

import assert from 'bsert';

import { walletInfo } from '../mappings';

class WalletInfo extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // location is window.location
    const { location, selectWallet, selectedWallet } = this.props;
    assert(location.pathname);

    /*
     * be careful with creating dependency on pathname
     * working assumption:
     * the walletId will be the last part of the path
     * ie: /bwallet/wallets/primary
     */
    const names = location.pathname.split('/');
    const walletId = names[names.length - 1];

    // only select wallet if it has yet to be selected
    // this prevents an infinite loop
    if (selectedWallet !== walletId) selectWallet(walletId);
  }

  static get propTypes() {
    return {
      location: PropTypes.object.isRequired,
      selectWallet: PropTypes.func,
      selectedWallet: PropTypes.string,
    };
  }

  render() {
    // TODO: figure out how to handle
    // the case in which a multisig wallet
    // and a regular wallet have the same name

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
