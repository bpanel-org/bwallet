import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Text, Input, Button, Dropdown } from '@bpanel/bpanel-ui';
import BoxGrid from './BoxGrid';
import Label from './Label';

class JoinWallet extends PureComponent {
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

    const path = `/bwallet/multisig-complete/${selectedWallet}`;
    this.navigate(path);
  }

  render() {
    const { selectedWallet } = this.props;
    return (
      <BoxGrid rowClass="text-center" colClass="flex-column justify-content-center m-auto" colcount={2}>
        <BoxGrid rowClass="d-inline" colcount={1}>
          <Text>Please plug in hardware</Text>
          <Label className="d-flex align-items-start" text="Hardware Type">
            <Dropdown
              options={this.hardwareOptions}
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
          <Label className="d-flex align-items-start"  text="Cosigner Id">
            <Input
              name="cosignerId"
              placeholder="Cosigner ID"
              className="col"
              onChange={e => this.update('cosignerId', e.target.value)}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Join Key">
            <Input
              name="joinKey"
              placeholder="Join Key"
              className="col"
              onChange={e => this.update('joinKey', e.target.value)}
            />
          </Label>
          <Button onClick={() => this.join()}>Join</Button>
        </BoxGrid>
        <BoxGrid rowClass="d-inline" colcount={1}>
          <Text>
            You are joining M of N multisig wallet {selectedWallet}.
            Contact wallet creator for Join Key
          </Text>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default withRouter(JoinWallet);
