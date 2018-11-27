import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Input, Button, Dropdown } from '@bpanel/bpanel-ui';
import BoxGrid from './BoxGrid';
import Label from './Label';
import { HARDWARE_TYPES } from '../constants';

class ApproveReject extends PureComponent {
  constructor() {
    super();
    this.state = {
      cosignerToken: '',
      selectedHardware: '',
      accountNumber: '',
      proposal: {},
    };
  }

  static get propTypes() {
    return {
      selectedWallet: PropTypes.string,
      selectedProposal: PropTypes.object,
      approveProposal: PropTypes.func,
      rejectProposal: PropTypes.func,
      proposalDropdown: PropTypes.array,
    };
  }

  static get defaultProps() {
    return {
      proposalDropdown: [],
    };
  }

  update(key, value) {
    this.setState({ [key]: value });
  }

  approve() {
    const { approveProposal, selectedWallet } = this.props;
    const {
      accountNumber,
      cosignerToken,
      selectedHardware,
      proposal,
    } = this.state;

    if (selectedHardware === '') {
      alert('please select hardware wallet type');
      return;
    }
    if (accountNumber === '') {
      alert('please enter account number');
      return;
    }

    approveProposal(selectedWallet, proposal.name, {
      hardwareType: selectedHardware,
      cosignerToken,
      account: accountNumber,
    });
  }

  reject() {
    const { rejectProposal, selectedWallet } = this.props;
    const { proposal, cosignerToken } = this.state;
    rejectProposal(selectedWallet, proposal.name, cosignerToken);
  }

  renderProposalInfo() {
    const { proposal } = this.state;
    // a proposal is selected in this case
    if ('id' in proposal)
      return (
        <div>
          <Text type="p">Author: {proposal.author.name}</Text>
          <Text type="p">Approvals: {proposal.approvals.length}</Text>
          <Text type="p">Rejections: {proposal.rejections.length}</Text>
          <Text type="p">Status: {proposal.statusMessage}</Text>
          <Button className="p-2 m-2" onClick={() => this.approve()}>
            Approve
          </Button>
          <Button className="p-2 m-2" onClick={() => this.reject()}>
            Reject
          </Button>
        </div>
      );
    return (
      <div>
        <Text type="p">Select a proposal</Text>
      </div>
    );
  }

  render() {
    const { proposalDropdown } = this.props;

    return (
      <BoxGrid
        rowClass="text-center"
        colClass="flex-column justify-content-center m-auto"
        colcount={2}
      >
        <BoxGrid rowClass="" colcount={2}>
          <div>
            <Label className="d-flex align-items-start" text="Select Proposal">
              <Dropdown
                options={proposalDropdown}
                onChange={({ value }) => this.update('proposal', value)}
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
            <Label className="d-flex align-items-start" text="Hardware Type">
              <Dropdown
                options={HARDWARE_TYPES}
                onChange={({ value }) => this.update('selectedHardware', value)}
              />
            </Label>
            <Label className="d-flex align-items-start" text="Account Number">
              <Input
                type="number"
                name="accountNumber"
                className="col"
                placeholder="Account"
                onChange={e => this.update('accountNumber', e.target.value)}
              />
            </Label>
          </div>
          <div>{this.renderProposalInfo()}</div>
        </BoxGrid>
        <BoxGrid colcount={1}>
          <Text>Approve or Reject a Proposal</Text>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default ApproveReject;
