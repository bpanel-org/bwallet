import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header, Input, Button, Text } from '@bpanel/bpanel-ui';
import Label from './Label';
import BoxGrid from './BoxGrid';

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
    await this.setState({ [key]: value });
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
      <BoxGrid
        colcount={2}
        rowClass="text-center"
        colClass="flex-column justify-content-center m-auto"
      >
        <BoxGrid colcount={1}>
          <Label className="d-flex align-items-start" text="Wallet Name">
            <Input
              name="newWalletName"
              className="col"
              placeholder="Wallet Name"
              onChange={e => this.input('newWalletName', e.target.value)}
              value={newWalletName}
            />
          </Label>
          <Label className="d-flex align-items-start" text="HD Public Key">
            <Input
              name="xpub"
              className="col"
              placeholder="HD Public Key"
              onChange={e => this.input('xpub', e.target.value)}
              value={xpub}
            />
          </Label>
        </BoxGrid>
        <BoxGrid rowClass="d-inline" colcount={1}>
          <Header type="h4">Watch Only Wallet</Header>
          <Text type="p">Upload a HD Public Key and trigger a chain rescan</Text>
          <Button onClick={() => this.create(newWalletName, xpub)}>
            Import
          </Button>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default WatchOnly;
