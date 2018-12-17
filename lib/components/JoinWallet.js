import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Text, Input, Button, Dropdown } from '@bpanel/bpanel-ui';
import BoxGrid from './BoxGrid';
import Label from './Label';
import { pathBuilder, HARDWARE_TYPES } from '../constants';

class JoinWallet extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      cosignerId: '',
      joinKey: '',
      accountNumber: '0',
      selectedHardware: null,
    };

    this.hardwareOptions = HARDWARE_TYPES;
  }

  static get propTypes() {
    return {
      selectedWallet: PropTypes.string,
      joinWallet: PropTypes.func,
      history: PropTypes.object, // react router history
    };
  }

  static get defaultProps() {
    return {
      selectedWallet: '',
    };
  }

  update(key, value) {
    this.setState({ [key]: value });
  }

  navigate(path) {
    const { history } = this.props;
    history.push(path);
    history.goForward();
  }

  async join() {
    const { joinWallet, selectedWallet } = this.props;
    const { cosignerId, selectedHardware, joinKey, accountNumber } = this.state;

    await joinWallet(selectedWallet, {
      cosignerId,
      joinKey,
      account: accountNumber,
      hardwareType: selectedHardware,
    });

    const path = pathBuilder.multisigAction(selectedWallet, 'join');
    this.navigate(path);
  }

  render() {
    const { selectedWallet } = this.props;
    const { selectedHardware, accountNumber, cosignerId, joinKey } = this.state;
    return (
      <BoxGrid
        rowClass="text-center"
        colClass="flex-column justify-content-center m-auto"
        colcount={2}
      >
        <BoxGrid rowClass="d-inline" colcount={1}>
          <Text>Please plug in hardware</Text>
          <Label className="d-flex align-items-start" text="Hardware Type">
            <Dropdown
              options={this.hardwareOptions}
              onChange={({ value }) => this.update('selectedHardware', value)}
              value={selectedHardware}
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
          <Label className="d-flex align-items-start" text="Cosigner Id">
            <Input
              name="cosignerId"
              placeholder="Cosigner ID"
              className="col"
              value={cosignerId}
              onChange={e => this.update('cosignerId', e.target.value)}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Join Key">
            <Input
              name="joinKey"
              placeholder="Join Key"
              className="col"
              value={joinKey}
              onChange={e => this.update('joinKey', e.target.value)}
            />
          </Label>
          <Button onClick={() => this.join()}>Join</Button>
        </BoxGrid>
        <BoxGrid rowClass="d-inline" colcount={1}>
          <Text>
            You are joining M of N multisig wallet {selectedWallet}. Contact
            wallet creator for Join Key
          </Text>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default withRouter(JoinWallet);
