import React, { PureComponent } from 'react';
import { Text, Input, Button } from '@bpanel/bpanel-ui';
import TerminalView from './TerminalView';

class WatchOnly extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newWalletName: '',
      xpub: '',
    };
  }

  async input(key, value) {
    await this.setState(
      Object.assign({}, this.state, {
        [key]: value,
      })
    );
  }

  create(walletId, xpub) {
    const { createWallet } = this.props;

    const opts = {
      watchOnly: true,
      accountKey: xpub,
    }

    createWallet(walletId, opts);
  }

  render() {
    const { newWalletName, xpub } = this.state;

    return (
      <TerminalView>
        <div>
          <Text>Watch Only Wallet</Text>
          <Input
            name="newWalletName"
            placeholder="Wallet Name"
            onChange={e => this.input('newWalletName', e.target.value)}
            value={newWalletName}
          />
          <Input
            name="xpub"
            placeholder="xpub"
            onChange={e => this.input('xpub', e.target.value)}
            value={xpub}
          />
        </div>
        <div>
          <Button
            onClick={() => this.create(newWalletName, xpub)}
          >
            Import
          </Button>
        </div>
      </TerminalView>
    );
  }
}

export default WatchOnly;
