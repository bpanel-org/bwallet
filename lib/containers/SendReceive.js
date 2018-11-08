import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, Text, TabMenu } from '@bpanel/bpanel-ui';
import { Label, BoxGrid, SendFunds, ReceiveFunds, JoinWallet, CreateProposal, ApproveReject } from '../Components';

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
      allWallets: PropTypes.array,
      accounts: PropTypes.array,
      getWallets: PropTypes.func,
      selectAccount: PropTypes.func,
      selectWallet: PropTypes.func,
      selectedWallet: PropTypes.string,
      selectedAccount: PropTypes.string,
      sendTX: PropTypes.func,
      walletType: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      wallets: [],
      accounts: [],
      allWallets: [],
    };
  }

  async select(value, type) {
    switch (type) {
      case 'wallet':
        // see mappings/sendReceive allWallets list
        await this.props.selectWallet(value.label, value.value);
        // automatically select default account when
        // changing selected wallet
        await this.props.selectAccount(value.label, 'default');
        break;
      case 'account': {
        const { selectAccount, selectedWallet } = this.props;
        await selectAccount(selectedWallet, value.value);
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
      walletType,
    } = props;

    // TODO: watch only accounts cannot send funds
    // need to know if selected account is watch only

    // return tabs based on multisig or standard
    if (walletType === 'multisig')
      return [
        {
          header: 'Join',
          body: (<JoinWallet />),
        },
        {
          header: 'Propose',
          body: (<CreateProposal />),
        },
        {
          header: 'Approve/Reject',
          body: (<ApproveReject />),
        },
      ];
    else
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
    const { allWallets, accounts, selectedWallet, selectedAccount } = this.props;
    return (
      <BoxGrid rowClass="p-sm-2">
        <Label text="Select Wallet">
          <Dropdown
            options={allWallets}
            placeholder={selectedWallet || 'Select Wallet'}
            onChange={data => this.select(data, 'wallet')}
          />
        </Label>
        <Text>Funds will be sent or received from this Wallet</Text>
        <Dropdown
          options={accounts}
          placeholder={selectedAccount || 'Select Account'}
          onChange={data => this.select(data, 'account')}
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
