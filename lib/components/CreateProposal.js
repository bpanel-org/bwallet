import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Input, Button } from '@bpanel/bpanel-ui';
import BoxGrid from './BoxGrid';
import Label from './Label';

class CreateProposal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      proposalId: '',
      value: '',
      recipient: '',
      cosignerToken: '',
      rate: '',
    };
  }

  static get propTypes() {
    return {
      selectedWallet: PropTypes.string,
      unit: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      unit: 'BTC',
    };
  }

  update(key, value) {
    this.setState({ [key]: value });
  }

  async propose() {
    const { createProposal, selectedWallet } = this.props;
    const { proposalId, value, rate, recipient, cosignerToken } = this.state;

    try {
      await createProposal(selectedWallet, proposalId, {
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
    const { unit } = this.props;
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
              name="proposalId"
              placeholder="Proposal ID"
              onChange={e => this.update('proposalId', e.target.value)}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Value">
            <Input
              className="col"
              name="value"
              placeholder="Value"
              onChange={e => this.update('value', e.target.value)}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Recipient Address">
            <Input
              className="col"
              name="recipientAddress"
              placeholder={`${unit} Address`}
              onChange={e => this.update('recipient', e.target.value)}
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
          <Text>Create a payment proposal</Text>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default CreateProposal;
