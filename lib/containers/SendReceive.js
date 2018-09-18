import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, Dropdown, Text, TabMenu } from '@bpanel/bpanel-ui';
import { SendFunds, ReceiveFunds } from '../Components';

import { sendReceive } from '../mappings';

class SendReceive extends PureComponent {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const { getWallets } = this.props;
    await getWallets();
  }

  static get propTypes() {
    return {
      wallets: PropTypes.array,
      accounts: PropTypes.array,
      getWallets: PropTypes.func,
      selectAccount: PropTypes.func,
      selectWallet: PropTypes.func,
      selectedWallet: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      wallets: [],
      accounts: [],
    };
  }

  async select(value, type) {
    switch(type) {
      case 'wallet':
        await this.props.selectWallet(value);
        break;
      case 'account': {
        const { selectAccount, selectedWallet } = this.props;
        await selectAccount(selectedWallet, value);
      }
    }
  }

  render() {
    const tabs = [
      { header: 'Send Funds', body: <SendFunds /> },
      { header: 'Receive Funds', body: <ReceiveFunds /> },
    ];
    const { wallets, accounts } = this.props;
    // render amounts next to dropdowns
    return (
      <div>
        <Header type="h5">Select Wallet</Header>
        <Dropdown
          options={wallets}
          placeholder="Select Wallet"
          onChange={({ value }) => this.select(value, 'wallet')}
        />
        <Text>Funds will be sent or received from this Wallet</Text>
        <Dropdown
          options={accounts}
          placeholder="Select Account"
          onChange={({ value }) => this.select(value, 'account')}
        />
        <TabMenu tabs={tabs} />
      </div>
    );
  }
}

export default connect(
  sendReceive.mapStateToProps,
  sendReceive.mapDispatchToProps
)(SendReceive);
