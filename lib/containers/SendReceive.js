import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, Text, TabMenu } from '@bpanel/bpanel-ui';
import {
  Label,
  BoxGrid,
  SendFunds,
  ReceiveFunds,
  JoinWallet,
  CreateProposal,
  ApproveReject,
} from '../Components';

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
      joinWallet: PropTypes.func,
      walletType: PropTypes.string,
      getMultisigProposals: PropTypes.func,
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
        // see mappings/sendReceive.js allWallets function
        // to see how value object is built
        await this.props.selectWallet(value.label, value.value);
        // automatically select default account when
        // changing selected wallet
        await this.props.selectAccount(value.label, 'default');

        // fetch proposals for wallet if its multisig
        if (value.value === 'multisig')
          await this.props.getMultisigProposals(value.label);

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
      joinWallet,
      proposals,
      proposalDropdown,
      createProposal,
      approveProposal,
      rejectProposal,
    } = props;

    // TODO: watch only accounts cannot send funds
    // TODO: render receive instead of join
    // when it is fully joined
    // need to know if selected account is watch only

    // return tabs based on multisig or standard
    if (walletType === 'multisig')
      return [
        {
          header: 'Join',
          body: (
            <JoinWallet
              joinWallet={joinWallet}
              selectedWallet={selectedWallet}
            />
          ),
        },
        {
          header: 'Receive',
          body: (
            <ReceiveFunds
              selectedWallet={selectedWallet}
              selectedAccount={selectedAccount}
              receiveAddress={receiveAddress}
            />
          ),
        },
        {
          header: 'Propose',
          body: (
            <CreateProposal
              createProposal={createProposal}
              selectedWallet={selectedWallet}
            />
          ),
        },
        {
          header: 'Approve/Reject',
          body: (
            <ApproveReject
              proposals={proposals}
              selectedWallet={selectedWallet}
              proposalDropdown={proposalDropdown}
              approveProposal={approveProposal}
              rejectProposal={rejectProposal}
            />
          ),
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
  // TODO: only render dropdown if standard wallet
  render() {
    const {
      allWallets,
      accounts,
      selectedWallet,
      selectedAccount,
    } = this.props;
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
