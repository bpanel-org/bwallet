import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Input, Button, Dropdown, Header } from '@bpanel/bpanel-ui';
import TerminalView from './TerminalView';

import assert from 'bsert';
import { HardwareWallet, tobip44Account } from '../utilities';

const MAX_MULTISIG = 15;

class NewMultisigWallet extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      multisigWalletName: '',
      m: '',
      n: '',
      cosignerName: '',
      accountNumber: '',
      selectedHardware: '',
    };
    // TODO: add trezor
    this.hardwareOptions = ['ledger'];
    this.dropdownOptions = [];
    for (let i = 1; i <= MAX_MULTISIG; i++) this.dropdownOptions.push(`${i}`);
  }

  static get propTypes() {
    return {
      currentChain: PropTypes.string,
      createWallet: PropTypes.func,
    };
  }

  // NOTE: hard dependency on state
  async create() {
    const { createWallet, currentChain } = this.props;
    const {
      multisigWalletName,
      cosignerName,
      m,
      n,
      accountNumber,
      selectedHardware,
    } = this.state;

    assert(multisigWalletName, 'must have defined wallet name');
    assert(m, 'must have defined m value');
    assert(n, 'must have defined n value');
    assert(cosignerName, 'must have defined cosigner name');

    // TODO: this should be modularized into library
    // with dependency injection
    const account = parseInt(accountNumber, 10);
    const cosignerPath = tobip44Account(currentChain, account);
    const hardware = HardwareWallet.fromOptions(selectedHardware);
    // TODO: does this throw?
    await hardware.initialize();
    const xpub = hardware.getPublicKey(cosignerPath);
    await hardware.close();
    // done codepath that needs to move

    assert(xpub, 'must have defined xpub');

    const options = {
      m,
      n,
      xpub,
      cosignerName,
      cosignerPath,
    };

    createWallet(multisigWalletName, options, 'multisig');
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
    return (
      <TerminalView>
        <div>
          <Header type="h2">Multisig</Header>
          <Text>Please plug in hardware wallet</Text>

          <Dropdown
            options={this.hardwareOptions}
            onChange={({ value }) => this.update('selectedHardware', value)}
          />

          <div className="row">
            <Input
              name="multisigWalletName"
              placeholder="Wallet Name"
              onChange={e => this.update('multisigWalletName', e.target.value)}
            />
          </div>

          <div className="row">
            <Input
              name="cosignerName"
              placeholder="Cosigner Name"
              onChange={e => this.update('cosignerName', e.target.value)}
            />
          </div>

          <div className="row">
            <Text>Signatures Required (M)</Text>
            <Dropdown
              defaultValue="1"
              options={this.dropdownOptions}
              onChange={({ value }) => this.update('m', value)}
            />
          </div>

          <div className="row">
            <Text>Number of Participants (N)</Text>
            <Dropdown
              defaultValue="1"
              options={this.dropdownOptions}
              onChange={({ value }) => this.update('n', value)}
            />
          </div>

          <div className="row">
            <Text>Account Number</Text>
            <Input
              type="number"
              name="accountNumber"
              placeholder="Account"
              onChange={e => this.update('accountNumber', e.target.value)}
            />
          </div>
        </div>
        <div>
          <Text>About</Text>
          <Button onClick={() => this.create()}>Create</Button>
        </div>
      </TerminalView>
    );
  }
}

export default NewMultisigWallet;
