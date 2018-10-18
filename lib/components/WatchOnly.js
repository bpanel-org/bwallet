import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header, Input, Button } from '@bpanel/bpanel-ui';
import TerminalView from './TerminalView';

class WatchOnly extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newWalletName: '',
      xpub: '',
    };
  }

  static get propTypes() {
    return {
      createWallet: PropTypes.func,
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
    };

    createWallet(walletId, opts);
  }

  render() {
    const { newWalletName, xpub } = this.state;

    return (
      <TerminalView>
        <div>
          <Header type="h4">Watch Only Wallet</Header>
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
          <Button onClick={() => this.create(newWalletName, xpub)}>
            Import
          </Button>
        </div>
      </TerminalView>
    );
  }
}

export default WatchOnly;
