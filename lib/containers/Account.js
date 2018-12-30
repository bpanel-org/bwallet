import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TabMenu, Text, Button } from '@bpanel/bpanel-ui';
import {
  BoxGrid,
  SendFunds,
  ReceiveFunds,
  JoinWallet,
  CreateProposal,
  ApproveReject,
  List,
} from '../components';
import { WALLET_INFO_PENDING_MULTISIG_LIST_HEADERS } from '../constants/bwallet';
import { isEqual } from 'lodash';
import { account } from '../mappings';

class Account extends PureComponent {
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
      chain: PropTypes.string,
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
      selectedAccountBalance: PropTypes.string,
      selectedWalletTransactionCount: PropTypes.number,
      selectedAccountTransactionCount: PropTypes.number,
      selectedAccountUTXOCount: PropTypes.number,
      selectedAccountAvgUTXOSize: PropTypes.string,
      selectedAccountxpub: PropTypes.string,
      txhistory: PropTypes.array,
      tableProposals: PropTypes.array,
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
        // see mappings/account.js allWallets function
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

  detailsTab() {
    const {
      selectedAccountBalance,
      selectedAccountTransactionCount,
      selectedAccountUTXOCount,
      selectedAccountAvgUTXOSize,
      selectedAccountxpub = '',
      txhistory,
      walletType,
    } = this.props;
    return {
      header: 'Details',
      body: (
        <div>
          <div className="p-2">
            <div className="mt-4">
              <Text type="p">Balance: {selectedAccountBalance}</Text>
              <Text type="p">
                Transaction Count: {selectedAccountTransactionCount}
              </Text>
              <Text type="p">UTXO Count: {selectedAccountUTXOCount}</Text>
              <Text type="p">
                Average UTXO Size: {selectedAccountAvgUTXOSize}
              </Text>
              <Text type="p">
                Account Public Key (xpub):{' '}
                <Text type="condensed">{selectedAccountxpub}</Text>
              </Text>
            </div>
          </div>
          <div>
            {walletType === 'multisig' && this.renderPendingList()}
            <div>
              <List type="transaction" data={txhistory} text="Recent Tx List" />
            </div>
          </div>
        </div>
      ),
    };
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
      chain,
    } = this.props;
    return {
      header: 'Send',
      body: (
        <SendFunds
          selectedWallet={selectedWallet}
          selectedAccount={selectedAccount}
          selectedWalletInfo={selectedWalletInfo}
          selectedAccountInfo={selectedAccountInfo}
          chain={chain}
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
      header: 'Receive',
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
        tabs.push(this.detailsTab());
        tabs.push(this.receiveTab());
        tabs.push(this.proposeTab());
        tabs.push(this.approveRejectTab());
      }
    } else {
      // standard wallets can send and recieve
      tabs.push(this.detailsTab());
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

  renderPendingList() {
    const { tableProposals } = this.props;
    // decorate Select property on each proposal
    // so that it shows up in the table
    const data = tableProposals.map(d => {
      // render broadcast button if the proposal is complete
      if (d.Complete)
        d.Select = (
          <Button onClick={() => this.broadcast(d.Name)}>Broadcast</Button>
        );
      else
        d.Select = (
          <Button onClick={() => this.selectProposal(d.Name)}>Select</Button>
        );
      return d;
    });
    return (
      <div className="p-2">
        <List
          text="Pending Multiparty Transactions"
          headers={WALLET_INFO_PENDING_MULTISIG_LIST_HEADERS}
          data={data}
        />
      </div>
    );
  }

  // only render tabs if a wallet and account has been selected
  render() {
    const { selectedWallet, selectedAccount, selectedTab } = this.props;

    return (
      <BoxGrid rowClass="p-sm-2">
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
  account.mapStateToProps,
  account.mapDispatchToProps
)(Account);
