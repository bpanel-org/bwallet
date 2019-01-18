import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import { Button, Header } from '@bpanel/bpanel-ui';
import Card from '../components/Card';

import { List } from '../components';
import { OVERVIEW_MP_LIST_HEADERS } from '../constants';
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
      getWallets: PropTypes.func,
      getWalletInfo: PropTypes.func,
      multisigWallets: PropTypes.array,
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

  selectWalletInfo(walletId, walletType) {
    const { selectWallet, selectAccount } = this.props;

    selectWallet(walletId, walletType);
    selectAccount(walletId, 'default');
    this.navigate(`/bwallet/wallets/${walletType}/${walletId}`);
  }

  navigate(path) {
    const { history } = this.props;
    history.push(path);
    history.goForward();
  }

  makeCard(wallet, index) {
    if (wallet.name === 'Add New')
      return (
        <Card
          key={index}
          onClick={() => this.navigate('/bwallet/create')}
          header="Add New"
          icon="fa-plus"
        />
      );
    return (
      <Card
        key={index}
        onClick={() => this.selectWalletInfo(wallet.name, wallet.type)}
        header={wallet.name}
        {...wallet}
      />
    );
  }

  renderWalletsList() {
    const { walletsList } = this.props;
    const cards = [...walletsList];

    // adding a blank card to be the "Add New" block
    cards.push({ name: 'Add New' });

    const rows = [];
    while (cards.length) {
      rows.push(cards.splice(0, 4));
    }

    return (
      <React.Fragment>
        {rows.map((row, i) => (
          <div className="row mb-lg-3" style={{ minHeight: '200px' }} key={i}>
            {row.map((wallet, j) => this.makeCard(wallet, j))}
          </div>
        ))}
      </React.Fragment>
    );
  }

  render() {
    // TODO: make decoratable
    const { pendingMultiparty } = this.props;
    return (
      <div className="container">
        <Header type="h2">Wallets</Header>
        {this.renderWalletsList()}
        <List
          text="Pending Multiparty Wallets"
          headers={OVERVIEW_MP_LIST_HEADERS}
          data={this.decorateWithJoinButton(pendingMultiparty)}
          emptyText="No pending multi-party wallets to join..."
        />
      </div>
    );
  }
}

export default connect(
  overview.mapStateToProps,
  overview.mapDispatchToProps
)(withRouter(Overview));
