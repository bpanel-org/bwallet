import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Input, Button, Header } from '@bpanel/bpanel-ui';
import BoxGrid from './BoxGrid';

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
      <BoxGrid colcount={2}>
        <BoxGrid colcount={1}>
          <Text>Wallet Name</Text>
          <Input
            name="walletId"
            placeholder="Wallet Name"
            onChange={e => this.update('walletId', e.target.value)}
            value={walletId}
          />
          <Text>Must encrypt with Passphrase</Text>
          <Text>Please entry your passphrase twice</Text>
          <Input
            name="passphrase"
            type="password"
            placeholder="Passphrase"
            onChange={e => this.update('passphrase', e.target.value)}
            value={passphrase}
          />
          <Input
            name="passphraseBackup"
            type="password"
            placeholder="Passphrase"
            onChange={e => this.update('passphraseBackup', e.target.value)}
            value={passphraseBackup}
          />
        </BoxGrid>

        <BoxGrid colcount={1}>
          <Header type="h5">Node Managed</Header>
          <Text>Passphrase Encrypted Wallet</Text>
          <Button onClick={() => this.create()}>Create</Button>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default NewWallet;
