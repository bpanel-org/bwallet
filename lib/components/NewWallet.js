import React, { PureComponent } from 'react';
import { Text, Input, Button, Header } from '@bpanel/bpanel-ui';

class NewWallet extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      newWalletName: '',
      newWalletPassphrase: '',
    }
  }

  async input(key, value) {
    await this.setState(Object.assign({}, this.state, {
      [key]: value,
    }));
  }

  async create(walletId, passphrase) {
    const { createWallet } = this.props;

    // force to use passphrase
    if (passphrase === '')
      return;

    const opts = { passphrase };
    await createWallet(walletId, opts);
  }

  render() {
    const { newWalletName, newWalletPassphrase } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <Text>Wallet Name</Text>
            <div className="row">
              <Input
                name="newWalletName"
                placeholder="Wallet Name"
                onChange={(e) => this.input('newWalletName', e.target.value)}
                value={newWalletName}
              />
            </div>
            <Text>Must encrypt with Passphrase</Text>
            <div className="row">
              <Input
                name="newWalletPassphrase"
                placeholder="Passphrase"
                onChange={(e) => this.input('newWalletPassphrase', e.target.value)}
                value={newWalletPassphrase}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="row">
              <Header type="h5">Node Managed</Header>
            </div>
            <div className="row">
              <Text>Passphrase Encrypted Wallet</Text>
            </div>
            <div className="row">
              <Button
                onClick={() => this.create(newWalletName, newWalletPassphrase)}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NewWallet;
