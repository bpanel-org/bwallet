import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Text, Input, Button, Dropdown, Header } from '@bpanel/bpanel-ui';
import TerminalView from './TerminalView';
import Box from './Box';

import assert from 'bsert';


// TODO: remove these
import { HardwareWallet, tobip44Account } from '../utilities';
// use this insead
import { getxpub } from '../utilities';

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
      network: PropTypes.string.isRequired,
      history: PropTypes.object, // react-router history
    };
  }

  // NOTE: hard dependency on having access
  // to bpanel react-router
  async create() {
    const { createWallet, network, currentChain, history } = this.props;
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
    const cosignerPath = tobip44Account(currentChain, network, account);
    const hardware = HardwareWallet.fromOptions(selectedHardware);
    // TODO: this should throw and break
    await hardware.initialize();
    const hdpubkey = await hardware.getPublicKey(cosignerPath);
    await hardware.close();
    const xpub = hdpubkey.xpubkey(network);
    assert(xpub, 'must have defined xpub');
    // done codepath that needs to move

    const options = {
      m: parseInt(m, 10),
      n: parseInt(n, 10),
      xpub,
      cosignerName,
      cosignerPath,
    };

    // returns { xpub, path }

    createWallet(multisigWalletName, options, 'multisig');

    // navigate to multisig complete page
    history.push(`/bwallet/multisig-complete/${multisigWalletName}`);
    history.goForward();
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
        <Box>
          <Header type="h2">Multisig</Header>
          <Text>Please plug in hardware wallet</Text>
          <Dropdown
            options={this.hardwareOptions}
            onChange={({ value }) => this.update('selectedHardware', value)}
          />
          <Input
            name="multisigWalletName"
            placeholder="Wallet Name"
            onChange={e => this.update('multisigWalletName', e.target.value)}
          />
          <Input
            name="cosignerName"
            placeholder="Cosigner Name"
            onChange={e => this.update('cosignerName', e.target.value)}
          />
          <Text>Signatures Required (M)</Text>
          <Dropdown
            defaultValue="1"
            options={this.dropdownOptions}
            onChange={({ value }) => this.update('m', value)}
          />
          <Text>Number of Participants (N)</Text>
          <Dropdown
            defaultValue="1"
            options={this.dropdownOptions}
            onChange={({ value }) => this.update('n', value)}
          />
          <Text>Account Number</Text>
          <Input
            type="number"
            name="accountNumber"
            placeholder="Account"
            onChange={e => this.update('accountNumber', e.target.value)}
          />

        </Box>
        <Box justify="center">
          <Text>About</Text>
          <Button onClick={() => this.create()}>Create</Button>
        </Box>
      </TerminalView>
    );
  }
}

export default withRouter(NewMultisigWallet);
