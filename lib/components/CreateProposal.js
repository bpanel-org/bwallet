import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Input, Button } from '@bpanel/bpanel-ui';
import BoxGrid from './BoxGrid';
import Label from './Label';

class CreateProposal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      amount: '',
      recipient: '',
      cosignerToken: '',
    }
  }

  static get propTypes() {
    return {
      selectedWallet: PropTypes.string,
      ticker: PropTypes.string,
    };
  }

  // TODO implement ticker
  static get defaultProps() {
    return {
      ticker: 'BTC',
    };
  }

  update(key, value) {
    this.setState({ [key]: value });
  }

  propose() {
    console.log('Not implemented!');
  }

  render() {
    const { selectedWallet, ticker } = this.props;
    return (
      <BoxGrid rowClass="text-center" colClass="flex-column justify-content-center m-auto" colcount={2}>
        <BoxGrid rowClass="d-inline" colcount={1}>
          <Label className="d-flex align-items-start" text="Amount">
            <Input
              className="col"
              name="amount"
              placeholder="Amount"
              onChange={e => this.update('amount', e.target.value)}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Recipient Address">
            <Input
              className="col"
              name="recipientAddress"
              placeholder={`${ticker} Address`}
              onChange={e => this.update('recipient', e.target.value)}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Cosigner Token">
            <Input
              className="col"
              name="cosignerToken"
              placeholder="Cosigner Token"
              onChange={e => this.update('cosignerToken', e.target.value)}
            />
          </Label>
          <Button onClick={() => this.propose()}>Create</Button>
        </BoxGrid>
        <BoxGrid rowClass="d-inline" colcount={1}>
          <Text>
            Create a payment proposal
          </Text>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default CreateProposal;
