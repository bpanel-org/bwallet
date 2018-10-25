import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, Dropdown, Text, TabMenu } from '@bpanel/bpanel-ui';
import { BoxGrid, SendFunds, ReceiveFunds } from '../Components';

import { isEqual } from 'lodash';
import { sendReceive } from '../mappings';

// TODO: manage ticker (BTC, BCH, HNS)
class SendReceive extends PureComponent {
  async componentDidUpdate(prevProps) {
    if (!isEqual(this.props.wallets, prevProps.wallets)) {
      const { getWallets } = this.props;
      await getWallets();
    }
  }

  static get propTypes() {
    return {
      wallets: PropTypes.array,
      accounts: PropTypes.array,
      getWallets: PropTypes.func,
      selectAccount: PropTypes.func,
      selectWallet: PropTypes.func,
      selectedWallet: PropTypes.string,
      selectedAccount: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      wallets: [],
      accounts: [],
    };
  }

  async select(value, type) {
    switch (type) {
      case 'wallet':
        await this.props.selectWallet(value);
        // automatically select default account when
        // changing selected wallet
        await this.props.selectAccount(value, 'default');
        break;
      case 'account': {
        const { selectAccount, selectedWallet } = this.props;
        await selectAccount(selectedWallet, value);
      }
    }
  }

  // selectedWallet and selectedAccount are exclusively
  // used in this view
  tabBuilder(props) {
    const { address, selectedWallet, selectedAccount, createAddress } = props;

    return [{
      header: 'Send Funds',
      body: (
        <SendFunds
          selectedWallet={selectedWallet}
          selectedAccount={selectedAccount}
        />
      ),
    },
    {
      header: 'Receive Funds',
      body: (
        <ReceiveFunds
          createAddress={createAddress}
          selectedWallet={selectedWallet}
          selectedAccount={selectedAccount}
          address={address}
        />
      ),
    }];
  }

  render() {
    const { wallets, accounts, selectedWallet, selectedAccount } = this.props;
    const tabs = this.tabBuilder(this.props);
    // TODO: render amounts next to dropdowns
    return (
      <BoxGrid>
        <Header type="h5">Select Wallet</Header>
        <Dropdown
          options={wallets}
          placeholder={selectedWallet || 'Select Wallet'}
          onChange={({ value }) => this.select(value, 'wallet')}
        />
        <Text>Funds will be sent or received from this Wallet</Text>
        <Dropdown
          options={accounts}
          placeholder={selectedAccount || 'Select Account'}
          onChange={({ value }) => this.select(value, 'account')}
        />
        <TabMenu tabs={tabs} />
      </BoxGrid>
    );
  }
}

export default connect(
  sendReceive.mapStateToProps,
  sendReceive.mapDispatchToProps
)(SendReceive);
