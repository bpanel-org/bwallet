import React, { PureComponent } from 'react';
import { Dropdown, Header, Text, Input, Button } from '@bpanel/bpanel-ui';
import TerminalView from './TerminalView';
import { importWallet as style } from '../style';
import Box from './Box';
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
    const { state } = this;
    this.setState(
      Object.assign({}, state, {
        [key]: value,
      })
    );
  }

  render() {
    const { walletName, derivationPath, advanced } = this.state;

    return (
      <TerminalView>
        <Box justify="left">
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
          <Text
            onClick={() => this.update('advanced', !advanced)}
            style={style.hyperlink}
          >
            Advanced
          </Text>
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
        </Box>
        <Box justify="center">
          <Text>Select the device and account...</Text>
          <Button onClick={() => ({})}>Import</Button>
        </Box>
      </TerminalView>
    );
  }
}

export default ImportWallet;
