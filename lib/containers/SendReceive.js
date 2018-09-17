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

  componentDidMount() {
    // fetch wallets
    // set as state
  }

  static get propTypes() {
    return {
      wallets: PropTypes.array,
      accounts: PropTypes.array,
    };
  }

  static get defaultProps() {
    return {
      wallets: [],
      accounts: [],
    };
  }

  render() {
    const tabs = [
      { header: 'Send Funds', body: <SendFunds /> },
      { header: 'Receive Funds', body: <ReceiveFunds /> },
    ];
    const { wallets, accounts } = this.props;
    return (
      <div>
        <Header type="h5">Select Wallet</Header>
        <Dropdown options={wallets} placeholder='Select Wallet' />
        <Text>Funds will be sent or received from this Wallet</Text>
        <Dropdown options={accounts} placeholder='Select Account' />
        <TabMenu tabs={tabs} />
      </div>
    );
  }
}

export default connect(
  sendReceive.mapStateToProps,
  sendReceive.mapDispatchToProps
)(SendReceive);
