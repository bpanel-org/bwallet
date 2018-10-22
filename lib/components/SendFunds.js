import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Input, Button } from '@bpanel/bpanel-ui';
import Box from './Box';
import { fetchPrice } from '../utilities';

// TODO: handle generalized ticker
class SendFunds extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      address: '',
      passphrase: '',
      amount: '',
      rate: '',
      price: '',
    };
  }

  /*
   * ticker - cryptocurrency ticker
   * base   - base pair to compare against
   */
  static get propTypes() {
    return {
      ticker: PropTypes.string,
      base: PropTypes.string,
      selectedWallet: PropTypes.string,
      selectedAccount: PropTypes.string,
    };
  }

  // fetch price info when input "amount" changes
  async componentDidUpdate(prevProps, prevState) {
    const { amount } = this.state;
    const { ticker, base } = this.props;
    if (amount !== prevState.amount) {
      const price = await fetchPrice(ticker, base);
      this.setState({ price });
    }
  }

  update(key, value) {
    this.setState({ [key]: value });
  }

  static get defaultProps() {
    return {
      ticker: 'BTC',
      base: 'USD',
    };
  }

  async send() {
    const { address, passphrase, amount, rate } = this.state;
    const { sendTX, selectedWallet } = this.props;
    const opts = {
      value: amount,
      rate,
      passphrase,
      address,
    };
    await sendTX(selectedWallet, opts);
  }

  // TODO: if standard wallet with no selected account
  // don't render the bottom until account selected
  render() {
    const { ticker, selectedWallet, selectedAccount, base } = this.props;
    const { address, amount, price } = this.state;
    const total = price / amount;
    return (
      <Box axis="vertical">
        <Box axis="horizontal">
          <Input
            name="amount"
            placeholder="Amount"
            onChange={e => this.update('amount', e.target.value)}
          />
          <Input
            name={'address'}
            onChange={e => this.update('address', e.target.value)}
            placeholder={`${ticker} Address`}
          />
          <Input
            name="rate"
            placeholder="Rate"
            onChange={e => this.update('rate', e.target.value)}
          />
          <Input
            name={'passphrase'}
            onChange={e => this.update('passphrase', e.target.value)}
            placeholder="Passphrase"
          />
          <Button onClick={() => this.send()}>Send</Button>
        </Box>
        <Box axis="horizontal">
          <Text>
            You are sending {amount} {ticker} ({total} {base}) to {address} from{' '}
            {selectedAccount} in {selectedWallet}
          </Text>
        </Box>
      </Box>
    );
  }
}

export default SendFunds;
