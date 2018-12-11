import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, TabMenu } from '@bpanel/bpanel-ui';
import {
  Label,
  BoxGrid,
  SendFunds,
  ReceiveFunds,
  JoinWallet,
  CreateProposal,
  ApproveReject,
} from '../components';

import { isEqual } from 'lodash';
import { sendReceive } from '../mappings';

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
      unit: PropTypes.string,
      proposalMTX: PropTypes.object,
      selectTab: PropTypes.func,
      receiveAddress: PropTypes.string,
      createProposal: PropTypes.func,
      proposals: PropTypes.object,
      proposalDropdown: PropTypes.array,
      approveProposal: PropTypes.func,
      rejectProposal: PropTypes.func,
      selectProposal: PropTypes.func,
      selectedProposal: PropTypes.string,
      proposalInfo: PropTypes.object,
      proposalValue: PropTypes.string,
      proposalRecipient: PropTypes.string,
      createAddress: PropTypes.func,
      selectedTab: PropTypes.number,
      selectedWalletInfo: PropTypes.object,
      selectedAccountInfo: PropTypes.object,
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
        // revert to first tab for newly selected wallet
        this.selectTab(0);
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

  joinTab() {
    const { joinWallet, selectedWallet } = this.props;
    return {
      header: 'Join',
      body: (
        <JoinWallet joinWallet={joinWallet} selectedWallet={selectedWallet} />
      ),
    };
  }
  proposeTab() {
    const { createProposal, selectedWallet } = this.props;
    return {
      header: 'Propose',
      body: (
        <CreateProposal
          createProposal={createProposal}
          selectedWallet={selectedWallet}
        />
      ),
    };
  }
  approveRejectTab() {
    const {
      proposals,
      selectedWallet,
      proposalDropdown,
      approveProposal,
      rejectProposal,
      selectProposal,
      selectedProposal,
      proposalMTX,
      proposalInfo,
      proposalValue,
      proposalRecipient,
    } = this.props;
    return {
      header: 'Approve/Reject',
      body: (
        <ApproveReject
          proposals={proposals}
          selectedWallet={selectedWallet}
          proposalDropdown={proposalDropdown}
          approveProposal={approveProposal}
          rejectProposal={rejectProposal}
          selectProposal={selectProposal}
          selectedProposal={selectedProposal}
          proposalMTX={proposalMTX}
          proposalInfo={proposalInfo}
          proposalValue={proposalValue}
          proposalRecipient={proposalRecipient}
        />
      ),
    };
  }
  sendTab() {
    const {
      selectedWallet,
      selectedAccount,
      sendTX,
      unit,
      selectedWalletInfo,
      selectedAccountInfo,
    } = this.props;
    return {
      header: 'Send Funds',
      body: (
        <SendFunds
          selectedWallet={selectedWallet}
          selectedAccount={selectedAccount}
          selectedWalletInfo={selectedWalletInfo}
          selectedAccountInfo={selectedAccountInfo}
          sendTX={sendTX}
          watchOnly={true}
          unit={unit}
        />
      ),
    };
  }

  receiveTab() {
    const {
      createAddress,
      selectedWallet,
      selectedAccount,
      receiveAddress,
    } = this.props;
    return {
      header: 'Receive Funds',
      body: (
        <ReceiveFunds
          createAddress={createAddress}
          selectedWallet={selectedWallet}
          selectedAccount={selectedAccount}
          receiveAddress={receiveAddress}
        />
      ),
    };
  }

  // build dynamic tabs based on type of wallet
  tabBuilder(props) {
    const { walletType, selectedWalletInfo } = props;

    const tabs = [];

    // return tabs based on multisig or standard
    if (walletType === 'multisig') {
      // only render join if not initialized
      if (!selectedWalletInfo.initialized) tabs.push(this.joinTab());
      // otherwise can interact with initialized
      // mulitisig wallet
      else {
        tabs.push(this.receiveTab());
        tabs.push(this.proposeTab());
        tabs.push(this.approveRejectTab());
      }
    } else {
      // standard wallets can send and recieve
      tabs.push(this.sendTab());
      tabs.push(this.receiveTab());
    }
    return tabs;
  }

  // first argument of selectTab is the menu id
  selectTab(i) {
    const { selectTab } = this.props;
    selectTab('sendReceive', i);
  }

  // only render tabs if a wallet and account has been selected
  render() {
    const {
      allWallets,
      accounts,
      selectedWallet,
      selectedAccount,
      selectedTab,
      walletType,
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
        {/* dont render account dropdown if multisig wallet */}
        {walletType !== 'multisig' && selectedWallet && (
          <Label text="Select Account">
            <Dropdown
              options={accounts}
              placeholder={selectedAccount || 'Select Account'}
              onChange={data => this.select(data, 'account')}
            />
          </Label>
        )}
        {selectedWallet && selectedAccount && (
          <TabMenu
            selectedIndex={selectedTab}
            onTabClick={i => this.selectTab(i)}
            tabs={this.tabBuilder(this.props)}
          />
        )}
      </BoxGrid>
    );
  }
}

export default connect(
  sendReceive.mapStateToProps,
  sendReceive.mapDispatchToProps
)(SendReceive);
