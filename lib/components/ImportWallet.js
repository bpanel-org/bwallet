import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Header, Text, Input, Button, Link } from '@bpanel/bpanel-ui';
import BoxGrid from './BoxGrid';
import Label from './Label';

// TODO: change deriavation placeholder path based on
// current network
class ImportWallet extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      walletName: '',
      selectedHardware: '',
      derivationPath: '',
      advanced: false,
    };

    // TODO: add trezor
    this.dropdownOptions = ['ledger'];
  }

  static get propTypes() {
    return {
      createHardwareWatchOnlyAccount: PropTypes.func,
    };
  }

  update(key, value) {
    this.setState({ [key]: value });
  }

  createAccount() {
    // TODO: implement using createHardwareWatchOnlyAccount
  }

  // TODO: instead of conditionally rendering the component,
  // conditionally apply d-none class
  render() {
    const { walletName, derivationPath, advanced } = this.state;

    return (
      <BoxGrid rowClass="text-center" colClass="flex-column justify-content-center m-auto" colcount={2}>
        <BoxGrid rowClass="d-inline" colcount={1}>
          <Header type="h5">Import Wallet</Header>
          <Label className="d-flex align-items-start" text="Wallet Name">
            <Input
              className="col"
              name="newWalletName"
              placeholder="Wallet Name"
              onChange={e => this.update('walletName', e.target.value)}
              value={walletName}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Hardware Device">
            <Dropdown
              options={this.dropdownOptions}
              onChange={({ value }) => this.update('selectedHardware', value)}
            />
          </Label>
          <Link dummy={true} className="align-items-start" onClick={() => this.update('advanced', !advanced)}>
            Advanced
          </Link>
          {advanced && (
            <Label className="d-flex align-items-start" text="Derivation Path">
              <Input
                className="col"
                name="derivationPath"
                placeholder="m'/44'/0'/0'"
                onChange={e => this.update('derivationPath', e.target.value)}
                value={derivationPath}
              />
            </Label>
          )}
        </BoxGrid>
        <BoxGrid colcount={1} rowClass="d-inline">
          <Text>Select the device and account...</Text>
          <Button onClick={() => this.createAccount()}>Import</Button>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default ImportWallet;
