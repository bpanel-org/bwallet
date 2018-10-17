import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header } from '@bpanel/bpanel-ui';
import { PendingMultiparty, RecentTxList, List } from '../components';

import { isEqual } from 'lodash';
import { overview } from '../mappings';

const OVERVIEW_WALLETS_LIST_HEADERS = [
  'Name',
  'Balance',
  'Watch Only',
  'Multi-Party',
];

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

  /*
   * TODO: for recent tx list, fetch n most recent txns from
   * each wallet and then sort
   */
  render() {
    const { walletsList, pendingMultiparty } = this.props;

    return (
      <div>
        <Header type="h2">Overview</Header>
        <List
          text="Wallets List"
          headers={OVERVIEW_WALLETS_LIST_HEADERS}
          data={walletsList}
        />
        <PendingMultiparty pendingMultiparty={pendingMultiparty} />
        <List type="transaction" text="Recent Tx List" />
      </div>
    );
  }
}

export default connect(
  overview.mapStateToProps,
  overview.mapDispatchToProps
)(Overview);
