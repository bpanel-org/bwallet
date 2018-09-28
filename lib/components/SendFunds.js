import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Input, Button } from '@bpanel/bpanel-ui';
import Box from './Box';
import TerminalView from './TerminalView';

// TODO: handle generalized ticker
class SendFunds extends PureComponent {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      ticker: PropTypes.string,
      selectedWallet: PropTypes.string,
      selectedAccount: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      ticker: 'BTC',
    };
  }

  send() {
    console.log('Not implemented!');
  }

  render() {
    const { ticker, selectedWallet, selectedAccount } = this.props;
    // TODO: if there is no selected wallet and account,
    // render the bottom without being usable
    return (
      <TerminalView>
        <Box>
          <Input name="amount" placeholder="Amount" />
          <Input name={'address'} placeholder={`${ticker} Address`} />
          <Input name={'password'} placeholder="Passphrase" />
          <Button onClick={() => this.send()}>Send</Button>
        </Box>
        <Box>
          <Text>
            You are sending xxx {ticker} (yyy currency) to ... from{' '}
            {selectedAccount} in {selectedWallet}
          </Text>
        </Box>
      </TerminalView>
    );
  }
}

export default SendFunds;
