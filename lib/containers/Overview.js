import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header } from '@bpanel/bpanel-ui';
import { List } from '../components';

import { isEqual } from 'lodash';

import { overview } from '../mappings';

class Overview extends PureComponent {
  constructor(props) {
    super(props);
    this.walletTypes = 'all';
  }

  static get propTypes() {
    return {
      wallets: PropTypes.array,
      walletsList: PropTypes.array,
      pendingMultiparty: PropTypes.array,
    };
  }

  static get defaultProps() {
    return {
      wallets: [],
      walletsList: [],
      pendingMultiparty: [],
    };
  }

  async componentDidUpdate(prevProps) {
    if (!isEqual(this.props.wallets, prevProps.wallets)) {
      const { getWallets, getWalletInfo } = this.props;
      await getWallets(this.walletTypes);
      const { wallets, multisigWallets } = this.props;

      for (const wallet of wallets) await getWalletInfo(wallet);

      for (const msWallet of multisigWallets)
        await getWalletInfo(msWallet, 'multisig');
    }
  }

  render() {
    const { walletsList, pendingMultiparty } = this.props;
    return (
      <div>
        <List text="Overview" headers={['Name', 'Balance', 'Watch Only', 'Multi-Sig']} data={walletsList} />
        <List text="Pending Multiparty Wallets" headers={['Name', 'Date', 'M of N', 'Init']} data={pendingMultiparty} />
        <List text="Recent Transaction List" type="transaction" />
      </div>
    );
  }
}

export default connect(
  overview.mapStateToProps,
  overview.mapDispatchToProps
)(Overview);
