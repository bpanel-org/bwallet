import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Input, Button, Header } from '@bpanel/bpanel-ui';
import BoxGrid from './BoxGrid';
import Label from './Label';

/*
 * TODO: give user indication of password strength
 * based on criteria
 * - password length
 * - upper/lowercase chars
 * - special characters/numbers
 */

class NewWallet extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      walletId: '',
      passphrase: '',
      passphraseBackup: '',
    };
  }

  static get propTypes() {
    return {
      createWallet: PropTypes.func,
    };
  }

  update(key, value) {
    this.setState({ [key]: value });
  }

  async create() {
    const { walletId, passphrase, passphraseBackup } = this.state;
    const { createWallet } = this.props;

    // TODO: add better way of alerting user
    if (walletId === '') {
      alert('Must name wallet');
      return;
    }

    // force to use passphrase
    if (passphrase === '') {
      alert('Must use passphrase');
      return;
    }

    if (passphrase !== passphraseBackup) {
      alert('Passphrases do not match');
      return;
    }

    // TODO: sidebar must refresh after this call
    const opts = { passphrase };
    await createWallet(walletId, opts);
  }

  render() {
    const { walletId, passphrase, passphraseBackup } = this.state;

    return (
      <BoxGrid
        rowClass="text-center"
        colClass="flex-column justify-content-center m-auto"
        colcount={2}
      >
        <BoxGrid colcount={1}>
          <Label className="d-flex align-items-start" text="Wallet Name">
            <Input
              className="col"
              name="walletId"
              placeholder="Wallet Name"
              onChange={e => this.update('walletId', e.target.value)}
              value={walletId}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Passphase">
            <Input
              className="col"
              name="passphrase"
              type="password"
              placeholder="Passphrase"
              onChange={e => this.update('passphrase', e.target.value)}
              value={passphrase}
            />
          </Label>
          <Label
            className="d-flex align-items-start"
            text="Enter Passphrase Again"
          >
            <Input
              className="col"
              name="passphraseBackup"
              type="password"
              placeholder="Passphrase"
              onChange={e => this.update('passphraseBackup', e.target.value)}
              value={passphraseBackup}
            />
          </Label>
        </BoxGrid>

        <BoxGrid rowClass="d-inline" colcount={1}>
          <Header type="h4">Node Managed</Header>
          <Text type="p">Passphrase Encrypted Wallet</Text>
          <Text type="p">Must use Passphrase</Text>
          <Button onClick={() => this.create()}>Create</Button>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default NewWallet;
