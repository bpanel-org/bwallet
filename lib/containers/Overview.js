import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Header } from '@bpanel/bpanel-ui';
import { WalletsList, PendingMultiparty, RecentTxList } from '../components';

import { overview } from '../maps';

class Overview extends PureComponent {
  constructor(props) {
    super(props);
    this.walletTypes = 'all';
  }

  async componentDidMount() {
    const { getWallets, getWalletInfo } = this.props;
    await getWallets(this.walletTypes);
    const { wallets, multisigWallets } = this.props;

    for (const wallet of wallets)
      await getWalletInfo(wallet);

    for (const msWallet of multisigWallets)
      await getWalletInfo(msWallet, 'multisig');
  }

  render() {
    const { walletsList } = this.props;
    return (
      <div>
        <Header type="h2">Overview</Header>
        <WalletsList walletsList={walletsList} />
        <PendingMultiparty />
        <RecentTxList />
      </div>
    );
  }
}

export default connect(
  overview.mapStateToProps,
  overview.mapDispatchToProps
)(Overview);
