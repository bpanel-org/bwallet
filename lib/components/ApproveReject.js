import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Input, Button, Dropdown } from '@bpanel/bpanel-ui';
import BoxGrid from './BoxGrid';
import Label from './Label';

class ApproveReject extends PureComponent {
  constructor() {
    super();
    this.state = {
      cosignerToken: '',
      selectedProposal: {},
    };
  }

  static get propTypes() {
    return {
      selectedWallet: PropTypes.string,
      selectedProposal: PropTypes.object,
    };
  }

  static get defaultProps() {
    return {};
  }

  update(key, value) {
    this.setState({ [key]: value });
  }

  approve() {
    console.log('Not implemented!');
  }

  reject() {
    console.log('Not implemented!');
  }

  render() {
    // TODO: fetch proposals and display info about selected proposal
    return (
      <BoxGrid
        rowClass="text-center"
        colClass="flex-column justify-content-center m-auto"
        colcount={2}
      >
        <BoxGrid rowClass="d-inline" colcount={1}>
          <Label className="d-flex align-items-start" text="Select Proposal">
            <Dropdown options={[]} />
          </Label>
          <Label className="d-flex align-items-start" text="Cosigner Token">
            <Input
              className="col"
              name="cosignerToken"
              placeholder="Cosigner Token"
              onChange={e => this.update('cosignerToken', e.target.value)}
            />
          </Label>
        </BoxGrid>
        <BoxGrid colcount={1}>
          <Text>Approve or Reject a Proposal</Text>
          <div className="d-flex align-items-center">
            <Button className="p-2" onClick={() => this.approve()}>
              Approve
            </Button>
            <Button className="p-2" onClick={() => this.reject()}>
              Reject
            </Button>
          </div>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default ApproveReject;
