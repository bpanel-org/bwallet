import React, { PureComponent } from 'react';
import { Dropdown, Header, Text, Input, Button, Link } from '@bpanel/bpanel-ui';
import BoxGrid from './BoxGrid';
import Label from './Label';

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

  update(key, value) {
    this.setState({ [key]: value });
  }

  render() {
    const { walletName, derivationPath, advanced } = this.state;

    return (
      <BoxGrid colcount={2}>
        <BoxGrid colcount={1}>
          <Header type="h5">Import Wallet</Header>
          <Input
            name="newWalletName"
            placeholder="Wallet Name"
            onChange={e => this.update('walletName', e.target.value)}
            value={walletName}
          />
          <Label text="Hardware Device">
            <Dropdown
              options={this.dropdownOptions}
              onChange={({ value }) => this.update('selectedHardware', value)}
            />
          </Label>
          <Link dummy={true} onClick={() => this.update('advanced', !advanced)}>
            Advanced
          </Link>
          {advanced && (
            <Label text="Derivation Path">
              <Input
                name="derivationPath"
                placeholder="m'/44'/0'/0'"
                onChange={e => this.update('derivationPath', e.target.value)}
                value={derivationPath}
              />
            </Label>
          )}
        </BoxGrid>
        <BoxGrid colcount={1}>
          <Text>Select the device and account...</Text>
          <Button onClick={() => ({})}>Import</Button>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default ImportWallet;
