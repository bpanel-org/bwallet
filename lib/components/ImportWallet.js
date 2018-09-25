import React, { PureComponent } from 'react';
import { Dropdown, Header, Text, Input, Button } from '@bpanel/bpanel-ui';
import TerminalView from './TerminalView';
import { importWallet as style } from '../style';

class ImportWallet extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      walletName: '',
      selectedHardware: '',
      derivationPath: '',
      advanced: false,
    }

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
        <div>
          <Header type="h5">Import Wallet</Header>
          <div className="row">
            <Input
              name="newWalletName"
              placeholder="Wallet Name"
              onChange={(e) => this.update('walletName', e.target.value)}
              value={walletName}
            />
          </div>
          <div className="row">
            <div className="col-md-6">
              <Text>Hardware Device</Text>
              <Dropdown
                options={this.dropdownOptions}
                onChange={({ value }) => this.update('selectedHardware', value)}
              />
            </div>
            <div className="col-md-6">
              <Text onClick={() => this.update('advanced', !advanced)} style={style.hyperlink}>Advanced</Text>
            </div>
          </div>
          {advanced &&
          (<div className="row">
            <Text>Derivation Path</Text>
            <Input
              name="derivationPath"
              placeholder="m'/44'/0'/0'"
              onChange={(e) => (this.update('derivationPath', e.target.value))}
              value={derivationPath}
            />
          </div>)}
        </div>
        <div>
          <Text>Select the device and account...</Text>
          <Button onClick={() => ({})}>Import</Button>
        </div>
      </TerminalView>
    );
  }
}

export default ImportWallet;
