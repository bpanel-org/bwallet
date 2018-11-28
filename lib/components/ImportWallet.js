import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Header, Text, Input, Button, Link } from '@bpanel/bpanel-ui';
import BoxGrid from './BoxGrid';
import Label from './Label';

const ACCOUNT = 0;
/*
 * import account 0 unless the user knows what they are
 * doing, then they can enter a custom path
 *
 * TODO: change deriavation placeholder path based on
 * the current network
 */
class ImportWallet extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      accountId: '',
      walletId: '',
      selectedHardware: '',
      derivationPath: '',
      advanced: false,
    };

    // TODO: add trezor
    this.dropdownOptions = ['ledger'];
  }

  static get propTypes() {
    return {
      getxpubCreateWatchOnly: PropTypes.func,
      wallets: PropTypes.array,
      chain: PropTypes.string,
      network: PropTypes.string,
    };
  }

  update(key, value) {
    this.setState({ [key]: value });
  }

  async createAccount() {
    const { getxpubCreateWatchOnly, chain, network } = this.props;
    const {
      walletId,
      accountId,
      derivationPath,
      selectedHardware,
    } = this.state;

    // TODO: try/catch regarding ledger error
    await getxpubCreateWatchOnly(walletId, accountId, {
      path: derivationPath,
      chain: chain,
      network: network,
      account: ACCOUNT,
      hardwareType: selectedHardware,
    });

    // TODO: redirect the page to a completion page
  }

  render() {
    const {
      accountId,
      derivationPath,
      advanced,
      walletId,
      selectedHardware,
    } = this.state;

    const { wallets } = this.props;

    let isHidden = {};
    if (!advanced) isHidden = { visibility: 'hidden' };

    return (
      <BoxGrid
        rowClass="text-center"
        colClass="flex-column justify-content-center m-auto"
        colcount={2}
      >
        <BoxGrid rowClass="d-inline" colcount={1}>
          <Label className="d-flex align-items-start" text="Wallet Name">
            <Dropdown
              options={wallets}
              onChange={({ value }) => this.update('walletId', value)}
              placeholder={walletId || 'Select Wallet'}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Account Name">
            <Input
              className="col"
              name="accountId"
              placeholder="Account Name"
              onChange={e => this.update('accountId', e.target.value)}
              value={accountId}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Hardware Device">
            <Dropdown
              options={this.dropdownOptions}
              onChange={({ value }) => this.update('selectedHardware', value)}
              placeholder={selectedHardware || 'Select Device Type'}
            />
          </Label>
          <Link
            dummy={true}
            className="align-items-start"
            onClick={() => this.update('advanced', !advanced)}
          >
            Advanced
          </Link>
          <Label
            style={isHidden}
            className="d-flex align-items-start d-none"
            text="Derivation Path"
          >
            <Input
              className="col"
              style={isHidden}
              name="derivationPath"
              placeholder="m'/44'/0'/0'"
              onChange={e => this.update('derivationPath', e.target.value)}
              value={derivationPath}
            />
          </Label>
        </BoxGrid>
        <BoxGrid colcount={1} rowClass="d-inline">
          <Header type="h4">Import Wallet</Header>
          <Text type="p">Select the device and account. By default, this will import account 0.</Text>
          <Button onClick={() => this.createAccount()}>Import</Button>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default ImportWallet;
