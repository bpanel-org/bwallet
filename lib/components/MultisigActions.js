import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Input, Button, Dropdown } from '@bpanel/bpanel-ui';
import TerminalView from './TerminalView';

import Box from './Box'
import Label from './Label';

// TODO: break into own file, export with router
class Join extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedHardware: '',
      cosignerId: '',
      joinKey: '',
      accountNumber: '',
    };

    // TODO: define this once
    this.hardwareOptions = ['ledger'];
  }

  static get propTypes() {
    return {
      selectedWallet: PropTypes.string,
      joinWallet: PropTypes.func,
    };
  }

  static get defaultProps() {
    return {};
  }

  update(key, value) {
    const { state } = this;
    this.setState(
      Object.assign({}, state, {
        [key]: value,
      })
    );
  }

  async join() {
    const { joinWallet, selectedWallet } = this.props;
    const {
      cosignerId,
      selectedHardware,
      joinKey,
      accountNumber
    } = this.state;

    const options = {
      walletId: selectedWallet,
      cosignerId,
      joinKey,
      account: accountNumber,
      hardwareType: selectedHardware,
    };

    await joinWallet(options);

    // redirect to multisig-complete page
    // to display cosigner token
    // TODO: <View> renders arbitrary <Box /> components
  }

  render() {
    const { selectedWallet } = this.props;
    return (
      <TerminalView>
        <Box justify="left">
          <Text>Please plug in hardware</Text>
          <Dropdown
            options={this.hardwareOptions}
            onChange={({ value }) => this.update('selectedHardware', value)}
          />
          <Label>
            <Input
              type="number"
              name="accountNumber"
              placeholder="Account"
              onChange={e => this.update('accountNumber', e.target.value)}
            />
          </Label>
          <Input name="cosignerId" placeholder="Cosigner ID" />
          <Input name="joinKey" placeholder="Join Key" />
          <Button onClick={() => this.join()}>Join</Button>
        </Box>

        <Box justify="center">
          <Text>
            You are joining M of N multisig wallet ${selectedWallet}.
            Contact wallet creator for Join Key
          </Text>
        </Box>
      </TerminalView>
    );
  }
}

class ApproveReject extends PureComponent {
  constructor(props) {
    super(props);
  }

  // TODO: selectProposal
  static get propTypes() {
    return {
      selectedWallet: PropTypes.string,
      selectedProposal: PropTypes.string,
    };
  }

  // TODO: temporary
  static get defaultProps() {
    return {
      proposal: {
        amount: 10,
        destination: 'aaa'
      }
    };
  }

  approve() {
    console.log('Not implemented!');
  }

  reject() {
    console.log('Not implemented!');
  }

  render() {
    const { selectedWallet, proposal } = this.props;
    return (
      <TerminalView>
        <Box justify="left">
          <Text>Approve Reject</Text>
          <Dropdown options={[]} />
          <Input name="cosignerToken" placeholder="Cosigner Token" />
          <Text>Amount</Text>
        </Box>
        <Box justify="center">
          <div>
            <Button onClick={() => this.approve()}>Approve</Button>
            <Button onClick={() => this.reject()}>Reject</Button>
          </div>
        </Box>
      </TerminalView>
    );
  }
}


class Propose extends PureComponent {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      selectedWallet: PropTypes.string,
    };
  }

  // TODO implement ticker
  static get defaultProps() {
    return {
      ticker: 'BTC',
    };
  }

  propose() {
    console.log('Not implemented!');
  }

  render() {
    const { selectedWallet, ticker } = this.props;
    return (
      <TerminalView>
        <Box justify="left">
          <div>
            <Input name="amount" placeholder="Amount" />
            <i className="fa fa-exchange" ariaHidden="true"></i>
            <Text>USD</Text>
          </div>
          <Input name="recipientAddress" placeholder={`${ticker} Address`} />
          <Input name="cosignerToken" placeholder="Cosigner Token" />
        </Box>
        <Box justify="center">
          <Text>
            You are joining M of N multisig wallet ${selectedWallet}.
            Contact wallet creator for Join Key
          </Text>
          <Button onClick={() => this.propose()}>Join</Button>
        </Box>
      </TerminalView>
    );
  }
}

export { Join, Propose, ApproveReject };
