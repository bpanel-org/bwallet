import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import { Button } from '@bpanel/bpanel-ui';

import { List } from '../components';
import { OVERVIEW_LIST_HEADERS, OVERVIEW_MP_LIST_HEADERS } from '../constants';
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
      recentTransactions: PropTypes.array,
      selectWallet: PropTypes.func,
      selectAccount: PropTypes.func,
      history: PropTypes.object, // react router history
    };
  }

  static get defaultProps() {
    return {
      wallets: [],
      walletsList: [],
      pendingMultiparty: [],
      recentTransactions: [],
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

  decorateWithJoinButton(pendingMultiparty) {
    return pendingMultiparty.map(p => {
      p.Join = (
        <Button onClick={() => this.selectWalletJoin(p.Name)}>Join</Button>
      );
      return p;
    });
  }

  selectWalletJoin(walletId) {
    const { selectWallet, selectAccount } = this.props;
    // this feature is only available for
    // multisig wallets
    selectWallet(walletId, 'multisig');
    selectAccount(walletId, 'default');
    this.navigate(`/bwallet/send-receive/${walletId}`);
  }

  navigate(path) {
    const { history } = this.props;
    history.push(path);
    history.goForward();
  }

  render() {
    const { walletsList, pendingMultiparty, recentTransactions } = this.props;
    return (
      <div className="container">
        <List
          text="Overview"
          headers={OVERVIEW_LIST_HEADERS}
          data={walletsList}
        />
        <List
          text="Pending Multiparty Wallets"
          headers={OVERVIEW_MP_LIST_HEADERS}
          data={this.decorateWithJoinButton(pendingMultiparty)}
        />
        <List
          text="Recent Transaction List"
          type="transaction"
          data={recentTransactions}
        />
      </div>
    );
  }
}

export default connect(
  overview.mapStateToProps,
  overview.mapDispatchToProps
)(withRouter(Overview));
