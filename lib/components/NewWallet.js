import React, { PureComponent } from 'react';
import { Text, Input, Button, Header } from '@bpanel/bpanel-ui';
import Box from './Box';

class NewWallet extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      newWalletName: '',
      newWalletPassphrase: '',
    };
  }

  input(key, value) {
    this.setState({ [key]: value });
  }

  async create(walletId, passphrase) {
    const { createWallet } = this.props;

    // force to use passphrase
    if (passphrase === '') {
      // TODO: add better way of alerting user
      alert('Must use passphrase');
      return;
    }

    // TODO: sidebar must refresh after this call
    const opts = { passphrase };
    await createWallet(walletId, opts);
  }

  render() {
    const { newWalletName, newWalletPassphrase } = this.state;

    return (
      <Box axis="vertical">
        <Box axis="horizontal">
          <Text>Wallet Name</Text>
          <Input
            name="newWalletName"
            placeholder="Wallet Name"
            onChange={e => this.input('newWalletName', e.target.value)}
            value={newWalletName}
          />
          <Text>Must encrypt with Passphrase</Text>
          <Input
            name="newWalletPassphrase"
            placeholder="Passphrase"
            onChange={e => this.input('newWalletPassphrase', e.target.value)}
            value={newWalletPassphrase}
          />
        </Box>

        <Box axis="horizontal">
          <Header type="h5">Node Managed</Header>
          <Text>Passphrase Encrypted Wallet</Text>
          <Button
            onClick={() => this.create(newWalletName, newWalletPassphrase)}
          >
            Create
          </Button>
        </Box>
      </Box>
    );
  }
}

export default NewWallet;
