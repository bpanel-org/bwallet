import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header, Text, Input, Button, Dropdown } from '@bpanel/bpanel-ui';
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
      selectedProposal: PropTypes.string,
      approveProposal: PropTypes.func,
      rejectProposal: PropTypes.func,
      proposalDropdown: PropTypes.array,
      selectProposal: PropTypes.func,
      proposalMTX: PropTypes.object,
      proposalInfo: PropTypes.object,
      proposalValue: PropTypes.string,
      proposalRecipient: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      proposalDropdown: [],
      proposalInfo: {
        author: {},
        approvals: [],
        rejections: [],
      },
    };
  }

  componentDidMount() {
    const { selectedProposal, proposals, selectedWallet, selectProposal  } = this.props;
    // make sure to unselect proposal when switching between wallets
    if (selectedProposal && !proposals.map(p => p.name).includes(selectedProposal))
      selectProposal(selectedWallet, undefined);
  }

  update(key, value) {
    this.setState({ [key]: value });
  }

  approve() {
    const { approveProposal, selectedWallet, selectedProposal } = this.props;
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

    approveProposal(selectedWallet, selectedProposal, {
      hardwareType: selectedHardware,
      cosignerToken,
      account: accountNumber,
    });
  }

  reject() {
    const { rejectProposal, selectedWallet, selectedProposal } = this.props;
    const { cosignerToken } = this.state;
    rejectProposal(selectedWallet, selectedProposal, cosignerToken);
  }

  selectProposal(proposalId) {
    const { selectProposal, selectedWallet } = this.props;
    selectProposal(selectedWallet, proposalId);
  }

  /*
   * allows for using css to hide the html
   * when there is no selected proposal
   */
  makeProposalSafe(proposal = {}) {
    if (!proposal.author) proposal.author = {};
    if (!proposal.rejections) proposal.rejections = [];
    if (!proposal.approvals) proposal.approvals = [];
    return proposal;
  }

  renderProposalInfo() {
    let { proposalInfo, proposalValue, proposalRecipient } = this.props;

    const { cosignerToken, selectedHardware, accountNumber } = this.state;

    // add properties that may be missing
    proposalInfo = this.makeProposalSafe(proposalInfo);

    // hide based on selected proposal
    let style = { visibility: 'hidden' };
    if (proposalInfo && 'id' in proposalInfo) style = {};

    return (
      <BoxGrid rowClass="p-sm-2" style={style}>
        <Label className="d-flex align-items-start" text="Cosigner Token">
          <Input
            className="col"
            name="cosignerToken"
            placeholder="Cosigner Token"
            value={cosignerToken}
            onChange={e => this.update('cosignerToken', e.target.value)}
          />
        </Label>
        <Label className="d-flex align-items-start" text="Hardware Type">
          <Dropdown
            options={HARDWARE_TYPES}
            value={selectedHardware}
            onChange={({ value }) => this.update('selectedHardware', value)}
          />
        </Label>
        <Label className="d-flex align-items-start" text="Account Number">
          <Input
            type="number"
            name="accountNumber"
            className="col"
            placeholder="Account"
            value={accountNumber}
            onChange={e => this.update('accountNumber', e.target.value)}
          />
        </Label>
        <BoxGrid childrenClass="p-2 d-flex flex-column" colcount={2}>
          <div>
            <Label className="d-flex align-items-start" text="Creator ID">
              <Text>{proposalInfo.author.name}</Text>
            </Label>
            <Label className="d-flex align-items-start" text="Amount">
              <Text>{proposalValue}</Text>
            </Label>
            <Label className="d-flex align-items-start" text="Recipient">
              <Text type="condensed">{proposalRecipient}</Text>
            </Label>
          </div>
          <div>
            <Label className="d-flex align-items-start" text="Approvals">
              <Text>{proposalInfo.approvals.length}</Text>
            </Label>
            <Label className="d-flex align-items-start" text="Rejections">
              <Text>{proposalInfo.rejections.length}</Text>
            </Label>
            <Label className="d-flex align-items-start" text="Status">
              <Text>{proposalInfo.statusMessage}</Text>
            </Label>
          </div>
        </BoxGrid>
        <div className="d-flex flex-row justify-content-center">
          <div className="flex-grow-1" />
          <Button className="p-2 m-3" onClick={() => this.approve()}>
            Approve
          </Button>
          <Button className="p-2 m-3" onClick={() => this.reject()}>
            Reject
          </Button>
          <div className="flex-grow-1" />
        </div>
      </BoxGrid>
    );
  }

  renderSideCopy() {
    const {
      selectedProposal,
      proposalInfo,
      selectedWallet,
      proposalValue,
    } = this.props;

    if (selectedProposal) {
      let m, n;
      if (proposalInfo) {
        m = proposalInfo.m;
        n = proposalInfo.n;
      }

      return (
        <div>
          <Text type="p">
            {m} of {n} signatures
          </Text>
          <Text type="p">
            Proposal to send {proposalValue} via wallet {selectedWallet}
          </Text>
        </div>
      );
    }
    return <div />;
  }

  render() {
    const { proposalDropdown, selectedProposal } = this.props;

    return (
      <BoxGrid
        rowClass="text-center"
        colClass="flex-column justify-content-center m-auto"
        colcount={2}
      >
        <BoxGrid rowClass="" colcount={1}>
          <Label className="d-flex align-items-start" text="Select Proposal">
            <Dropdown
              options={proposalDropdown}
              onChange={({ label }) => this.selectProposal(label)}
              placeholder={'Select Proposal'}
              value={selectedProposal}
            />
          </Label>
          {/* render additional fields only if there is a selected proposal */}
          {this.renderProposalInfo()}
        </BoxGrid>
        <BoxGrid colcount={1}>
          <Header type="h2">Multi Signature Transfer</Header>
          {this.renderSideCopy()}
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default ApproveReject;
