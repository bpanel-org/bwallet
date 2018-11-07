import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Text, Input, Button, Dropdown, Header } from '@bpanel/bpanel-ui';
import BoxGrid from './BoxGrid';
import Label from './Label';

// calculate the dropdown options one time
const MAX_MULTISIG = 15;
const dropdownOptions = [];
for (let i = 1; i <= MAX_MULTISIG; i++) dropdownOptions.push(`${i}`);

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
    this.hardwareOptions = ['ledger'];
    this.dropdownOptions = dropdownOptions;
  }

  static get propTypes() {
    return {
      createWallet: PropTypes.func,
      network: PropTypes.string.isRequired,
      history: PropTypes.object, // react-router history
      chain: PropTypes.string,
      network: PropTypes.string,
    };
  }

  create() {
    const { multisigWalletName, m, n, accountNumber, selectedHardware, cosignerName } = this.state;
    const { getxpubCreateMultisigWallet, chain, network } = this.props;

    // TODO: better way to validate
    if (multisigWalletName === '') {
      alert('must enter wallet name');
      return;
    }

    getxpubCreateMultisigWallet(multisigWalletName, {
      chain,
      network,
      account: parseInt(accountNumber, 10),
      hardwareType: selectedHardware,
      m: parseInt(m, 10),
      n: parseInt(n, 10),
      cosignerName,
    });

    // TODO: turn this path into a constant
    const path = `/bwallet/multisig-complete/${multisigWalletName}`;
    this.navigate(path);
  }

  navigate(path) {
    const { history } = this.props;
    const { multisigWalletName } = this.state;
    history.push(path);
    history.goForward();
  }

  update(key, value) {
    this.setState({ [key]: value });
  }

  render() {
    return (
      <BoxGrid
        rowClass="text-center"
        colClass="flex-column justify-content-center m-auto"
        colcount={2}
      >
        <BoxGrid rowClass="p-sm-2" colcount={1}>
          <Header type="h2">Multisig</Header>
          <Text>Please plug in hardware wallet</Text>
          <Label className="d-flex align-items-start" text="Hardware Wallet Type">
            <Dropdown
              options={this.hardwareOptions}
              onChange={({ value }) => this.update('selectedHardware', value)}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Wallet Name">
            <Input
              className="col"
              name="multisigWalletName"
              placeholder="Wallet Name"
              onChange={e => this.update('multisigWalletName', e.target.value)}
            />
          </Label>

          <Label className="d-flex align-items-start" text="Cosigner Name">
            <Input
              className="col"
              name="cosignerName"
              placeholder="Cosigner Name"
              onChange={e => this.update('cosignerName', e.target.value)}
            />
          </Label>

          <Label
            className="d-flex align-items-start"
            text="Signatures Required (M)"
          >
            <Dropdown
              defaultValue="1"
              options={this.dropdownOptions}
              onChange={({ value }) => this.update('m', value)}
            />
          </Label>

          <Label
            className="d-flex align-items-start"
            text="Number of Participants (N)"
          >
            <Dropdown
              defaultValue="1"
              options={this.dropdownOptions}
              onChange={({ value }) => this.update('n', value)}
            />
          </Label>
          <Label className="d-flex align-items-start" text="Account Number">
            <Input
              type="number"
              className="col"
              min="0"
              name="accountNumber"
              placeholder="Account"
              onChange={e => this.update('accountNumber', e.target.value)}
            />
          </Label>
        </BoxGrid>
        <BoxGrid colcount={1}>
          <Text>Create a multisig wallet</Text>
          <Button onClick={() => this.create()}>
            Create
          </Button>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default withRouter(NewMultisigWallet);
