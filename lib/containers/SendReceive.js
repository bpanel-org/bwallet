import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, Dropdown, Text, TabMenu } from '@bpanel/bpanel-ui';
import { Label, BoxGrid, SendFunds, ReceiveFunds } from '../Components';

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
      sendTX: PropTypes.func,
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
    const {
      receiveAddress,
      selectedWallet,
      selectedAccount,
      createAddress,
      sendTX,
    } = props;

    return [
      {
        header: 'Send Funds',
        body: (
          <SendFunds
            selectedWallet={selectedWallet}
            selectedAccount={selectedAccount}
            sendTX={sendTX}
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
            receiveAddress={receiveAddress}
          />
        ),
      },
    ];
  }

  // only render tabs if a wallet and account has been selected
  render() {
    const { wallets, accounts, selectedWallet, selectedAccount } = this.props;
    return (
      <BoxGrid rowClass="p-sm-2">
        <Label text="Select Wallet">
          <Dropdown
            options={wallets}
            placeholder={selectedWallet || 'Select Wallet'}
            onChange={({ value }) => this.select(value, 'wallet')}
          />
        </Label>
        <Text>Funds will be sent or received from this Wallet</Text>
        <Dropdown
          options={accounts}
          placeholder={selectedAccount || 'Select Account'}
          onChange={({ value }) => this.select(value, 'account')}
        />
        {selectedWallet &&
          selectedAccount && <TabMenu tabs={this.tabBuilder(this.props)} />}
      </BoxGrid>
    );
  }
}

export default connect(
  sendReceive.mapStateToProps,
  sendReceive.mapDispatchToProps
)(SendReceive);
