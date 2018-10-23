import React, { PureComponent } from 'react';
import { Text, Input, Button, Header } from '@bpanel/bpanel-ui';
import BoxGrid from './BoxGrid';

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
      <BoxGrid colcount={2}>
        <BoxGrid colcount={1}>
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
        </BoxGrid>

        <BoxGrid colcount={1}>
          <Header type="h5">Node Managed</Header>
          <Text>Passphrase Encrypted Wallet</Text>
          <Button
            onClick={() => this.create(newWalletName, newWalletPassphrase)}
          >
            Create
          </Button>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default NewWallet;
