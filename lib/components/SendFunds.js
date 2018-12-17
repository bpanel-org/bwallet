import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Input, Button } from '@bpanel/bpanel-ui';
import { Currency } from '@bpanel/bpanel-utils';
import BoxGrid from './BoxGrid';
import Label from './Label';

class SendFunds extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      address: '',
      passphrase: '',
      amount: '0',
      rate: '',
      price: '',
    };
  }

  static get propTypes() {
    return {
      unit: PropTypes.string,
      ticker: PropTypes.string,
      selectedWallet: PropTypes.string,
      selectedAccount: PropTypes.string,
      sendTX: PropTypes.func,
      chain: PropTypes.string,
    };
  }

  update(key, value) {
    this.setState({ [key]: value });
  }

  static get defaultProps() {
    return {
      unit: 'btc',
      ticker: 'BTC',
      chain: '',
    };
  }

  async send() {
    const { address, passphrase, amount, rate } = this.state;
    const {
      sendTX,
      selectedWallet,
      selectedAccount,
      selectedAccountInfo,
    } = this.props;

    // TODO: handle flexible amount, ie different units
    // TODO: differentiate between watch only and hardware
    // for now, any watch only is assumed to be hardware
    // watchOnly is a bool
    const hardware = selectedAccountInfo.watchOnly;
    try {
      await sendTX(selectedWallet, {
        value: amount,
        rate,
        passphrase,
        address,
        accountId: selectedAccount,
        hardware,
        xpub: selectedAccountInfo.accountKey,
      });
      alert(`Send success!`);
    } catch (e) {
      // TODO: better way to alert users on failure
      alert(e.message);
    }
  }

  convertCurrencyWithLabel(amount, unit = 'ticker') {
    const { chain } = this.props;
    if (typeof amount === 'string') amount = parseInt(amount, 10) || 0;
    const value = new Currency(chain, amount).withLabel(unit);
    return value;
  }

  // TODO: input placeholder dynamic based on chain
  render() {
    const { selectedWallet, selectedAccount, ticker } = this.props;
    const { address, amount, rate, value, passphrase, price } = this.state;

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
              value={amount}
              onChange={e => this.update('amount', e.target.value)}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Address">
            <Input
              className="col"
              name="address"
              value={address}
              onChange={e => this.update('address', e.target.value)}
              placeholder={`${ticker} Address`}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Rate">
            <Input
              className="col"
              name="rate"
              placeholder="Rate (sat/byte)"
              value={value}
              onChange={e => this.update('rate', e.target.value)}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Passphrase">
            <Input
              className="col"
              name="passphrase"
              value={passphrase}
              type="password"
              onChange={e => this.update('passphrase', e.target.value)}
              placeholder="Passphrase"
            />
          </Label>
          <Button onClick={() => this.send()}>Send</Button>
        </BoxGrid>
        <BoxGrid rowClass="d-inline" colcount={1}>
          <Text className="m-auto">
            You are sending {this.convertCurrencyWithLabel(amount)} to{' '}
            {address || 'Add Recipient'} from {selectedAccount} in{' '}
            {selectedWallet}
          </Text>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default SendFunds;
