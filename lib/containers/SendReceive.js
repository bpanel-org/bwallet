import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, Dropdown, Text, TabMenu } from '@bpanel/bpanel-ui';
import { SendFunds, ReceiveFunds } from '../Components';

import { isEqual } from 'lodash';
import { sendReceive } from '../mappings';

// TODO: this is a hack
// to maintain state between component mountings
let temp;

// TODO: manage ticker (BTC, BCH, HNS)
class SendReceive extends PureComponent {
  constructor() {
    super();
    this.state = {
      walletType: '',
    };
  }

  // prevent infinite loop
  async componentDidUpdate(prevProps) {
    const { wallets, multisigWallets } = this.props;
    const equal =
      isEqual(wallets, prevProps.wallets) &&
      isEqual(multisigWallets, prevProps.multisigWallets);
    if (!equal) {
      const { getWallets } = this.props;
      await getWallets('all');
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
    };
  }

  static get defaultProps() {
    return {
      wallets: [],
      accounts: [],
      allWallets: [],
    };
  }

  async select(label, value, type) {
    switch (type) {
      case 'wallet':
        temp = value; // NOTE: hack
        await this.props.selectWallet(label);
        break;
      case 'account': {
        const { selectAccount, selectedWallet } = this.props;
        await selectAccount(selectedWallet, label);
      }
    }
  }

  // TODO: render amounts next to dropdowns
  // TODO: this logic is too complex for render method
  render() {
    const {
      allWallets,
      accounts,
      selectedWallet,
      selectedAccount,
    } = this.props;

    let tabs;
    if (temp === 'multisig')
      tabs = [
        {
          header: 'Join',
          body: <div />,
        },
        {
          header: 'Propose',
          body: <div />,
        },
        {
          header: 'Approve/Reject',
          body: <div />,
        },
      ];
    else
      tabs = [
        {
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
          body: <ReceiveFunds />,
        },
      ];

    // TODO: figure out placeholder problem
    // it doesn't render the value after selecting it
    let render;
    if (temp === 'standard')
      render = (
        <div>
          <Text>Funds will be sent or received from this Wallet</Text>
          <Dropdown
            options={accounts}
            placeholder={selectedAccount || 'Select Account'}
            onChange={({ label, value }) =>
              this.select(label, value, 'account')
            }
          />
          <TabMenu tabs={tabs} />
        </div>
      );
    else if (temp === 'multisig') render = <TabMenu tabs={tabs} />;

    return (
      <div>
        <Header type="h5">Select Wallet</Header>
        <Dropdown
          options={allWallets}
          placeholder={selectedWallet || 'Select Wallet'}
          onChange={({ label, value }) => this.select(label, value, 'wallet')}
        />
        {render}
      </div>
    );
  }
}

export default connect(
  sendReceive.mapStateToProps,
  sendReceive.mapDispatchToProps
)(SendReceive);
