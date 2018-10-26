import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Input, Button } from '@bpanel/bpanel-ui';
import BoxGrid from './BoxGrid';
import { fetchPrice } from '../utilities';
import Label from './Label';

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
      sendTX: PropTypes.func,
    };
  }

  // fetch price info when input "amount" changes
  // TODO: find stable and free api that supports BTC/BCH/HNS
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
    const { sendTX, selectedWallet, selectedAccount } = this.props;
    const opts = {
      value: amount,
      rate,
      passphrase,
      address,
      accountId: selectedAccount,
    };
    try {
      await sendTX(selectedWallet, opts);
    } catch (e) {
      // TODO: better way to alert users on failure
      alert(e.message);
    }
  }

  render() {
    const { ticker, selectedWallet, selectedAccount, base } = this.props;
    const { address, amount } = this.state;
    return (
      <BoxGrid
        rowClass="text-center"
        colClass="flex-column justify-content-center m-auto"
        colcount={2}
      >
        <BoxGrid rowClass="d-inline" colcount={1}>
          <Label className="d-flex align-items-start" text="Amount">
            <Input
              className="col"
              name="amount"
              placeholder="Amount"
              onChange={e => this.update('amount', e.target.value)}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Address">
            <Input
              className="col"
              name={'address'}
              onChange={e => this.update('address', e.target.value)}
              placeholder={`${ticker} Address`}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Rate">
            <Input
              className="col"
              name="rate"
              placeholder="Rate"
              onChange={e => this.update('rate', e.target.value)}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Passphrase">
            <Input
              className="col"
              name={'passphrase'}
              type="password"
              onChange={e => this.update('passphrase', e.target.value)}
              placeholder="Passphrase"
            />
          </Label>
          <Button onClick={() => this.send()}>Send</Button>
        </BoxGrid>
        <BoxGrid rowClass="d-inline" colcount={1}>
          <Text className="m-auto">
            You are sending {amount} {ticker} (placeholder {base}) to {address}{' '}
            from {selectedAccount} in {selectedWallet}
          </Text>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default SendFunds;
