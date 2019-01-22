import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Input, Button } from '@bpanel/bpanel-ui';
import { Currency } from '@bpanel/bpanel-utils';
import BoxGrid from './BoxGrid';
import Label from './Label';

class CreateProposal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      recipient: '',
      cosignerToken: '',
      rate: '',
      memo: '',
    };
  }

  static get propTypes() {
    return {
      selectedWallet: PropTypes.string,
      unit: PropTypes.string,
      createProposal: PropTypes.func,
      chain: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      label: 'BTC',
    };
  }

  update(key, value) {
    this.setState({ [key]: value });
  }

  convertCurrencyWithLabel(amount, unit = 'ticker') {
    const { chain } = this.props;
    if (typeof amount === 'string') amount = parseInt(amount, 10) || 0;
    const value = new Currency(chain, amount).withLabel(unit);
    return value;
  }

  async propose() {
    const { createProposal, selectedWallet } = this.props;
    const { value, rate, recipient, cosignerToken, memo } = this.state;

    try {
      await createProposal(selectedWallet, {
        memo,
        value,
        recipient,
        cosignerToken,
        rate,
      });
      alert('success!');
    } catch (e) {
      alert(`error: ${e.message}`);
    }
  }

  render() {
    const { label, selectedWallet } = this.props;
    const { memo, value, recipient, cosignerToken, rate } = this.state;
    return (
      <BoxGrid
        rowClass="text-center"
        colClass="flex-column justify-content-center m-auto"
        colcount={2}
      >
        <BoxGrid rowClass="d-inline" colcount={1}>
          <Label className="d-flex align-items-start" text="Proposal ID">
            <Input
              className="col"
              name="memo"
              placeholder="Memo"
              value={memo}
              onChange={e => this.update('memo', e.target.value)}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Value">
            <Input
              className="col"
              name="value"
              placeholder="Value"
              value={value}
              onChange={e => this.update('value', e.target.value)}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Recipient Address">
            <Input
              className="col"
              name="recipientAddress"
              placeholder={`${label} Address`}
              value={recipient}
              onChange={e => this.update('recipient', e.target.value)}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Rate (Satoshis)">
            {/* TODO: dynamic placeholder */}
            <Input
              className="col"
              name="rate"
              value={rate}
              placeholder="Satoshis/Byte"
              onChange={e => this.update('rate', e.target.value)}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Cosigner Token">
            <Input
              className="col"
              name="cosignerToken"
              value={cosignerToken}
              placeholder="Cosigner Token"
              onChange={e => this.update('cosignerToken', e.target.value)}
            />
          </Label>
          <Button onClick={() => this.propose()}>Create</Button>
        </BoxGrid>
        <BoxGrid rowClass="d-inline" colcount={1}>
          <Text>
            Creating a payment proposal with {this.convertCurrencyWithLabel(value)}{' '}
            {recipient ? `to address ${recipient}` : ''} from {selectedWallet} with a
            rate of {rate || '0'} satoshis per byte
          </Text>

        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default CreateProposal;
