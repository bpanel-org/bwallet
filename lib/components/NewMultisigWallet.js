import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {
  Text,
  Input,
  Button,
  Label,
  Dropdown,
  Header,
} from '@bpanel/bpanel-ui';
import BoxGrid from './BoxGrid';

import { pathBuilder } from '../constants';

// calculate the dropdown options one time
const MAX_MULTISIG = 15;
const dropdownOptions = [];
for (let i = 1; i <= MAX_MULTISIG; i++) dropdownOptions.push(`${i}`);

class NewMultisigWallet extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      multisigWalletName: '',
      m: '1',
      n: '1',
      cosignerName: '',
      accountNumber: '0',
      selectedHardware: null,
    };
    this.hardwareOptions = ['ledger'];
    this.dropdownOptions = dropdownOptions;
  }

  static get propTypes() {
    return {
      createWallet: PropTypes.func,
      history: PropTypes.object, // react-router history
      chain: PropTypes.string,
      network: PropTypes.string,
      getxpubCreateMultisigWallet: PropTypes.func,
    };
  }

  create() {
    const {
      multisigWalletName,
      m,
      n,
      accountNumber,
      selectedHardware,
      cosignerName,
    } = this.state;
    const { getxpubCreateMultisigWallet, chain, network } = this.props;

    if (multisigWalletName === '') {
      alert('must enter wallet name');
      return;
    }

    if (cosignerName === '') {
      alert('must enter cosigner name');
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

    // TODO: catch error here and only navigate
    // if there was no error

    const path = pathBuilder.multisigAction(multisigWalletName, 'new');
    this.navigate(path);
  }

  navigate(path) {
    const { history } = this.props;
    history.push(path);
    history.goForward();
  }

  update(key, _value) {
    const value = _value && _value.toString();
    this.setState({ [key]: value });
  }

  render() {
    const {
      selectedHardware,
      accountNumber,
      m,
      n,
      multisigWalletName,
      cosignerName,
    } = this.state;
    const labelStyle = { textAlign: 'left' };

    return (
      <BoxGrid
        rowClass="text-center"
        colClass="flex-column justify-content-center m-auto"
        colcount={2}
      >
        <BoxGrid rowClass="p-sm-2" colcount={1}>
          <Text>Please plug in hardware wallet</Text>
          <Label style={labelStyle} text="Hardware Wallet Type">
            <Dropdown
              options={this.hardwareOptions}
              onChange={({ value }) => this.update('selectedHardware', value)}
              placeholder={'Select Hardware Type'}
              value={selectedHardware}
            />
          </Label>
          <Label style={labelStyle} text="Wallet Name">
            <Input
              className="col"
              name="multisigWalletName"
              placeholder="Wallet Name"
              value={multisigWalletName}
              onChange={e => this.update('multisigWalletName', e.target.value)}
            />
          </Label>

          <Label style={labelStyle} text="Cosigner Name">
            <Input
              className="col"
              name="cosignerName"
              placeholder="Cosigner Name"
              value={cosignerName}
              onChange={e => this.update('cosignerName', e.target.value)}
            />
          </Label>

          <Label style={labelStyle} text="Signatures Required (M)">
            <Input
              placeholder="1"
              name="m"
              className="col py-1"
              type="number"
              max={MAX_MULTISIG}
              value={m}
              min="1"
              onChange={e => this.update('m', e.target.value)}
            />
          </Label>

          <Label style={labelStyle} text="Number of Participants (N)">
            <Input
              placeholder={this.state.m || '1'}
              name="n"
              className="col py-1"
              type="number"
              value={n}
              max={MAX_MULTISIG}
              min={this.state.m || '1'}
              onChange={e => this.update('n', e.target.value)}
            />
          </Label>
          <Label text="Account Number">
            <Input
              type="number"
              className="col py-1"
              min="0"
              value={accountNumber}
              name="accountNumber"
              placeholder="Account Index"
              onChange={e => this.update('accountNumber', e.target.value)}
            />
          </Label>
        </BoxGrid>
        <BoxGrid colcount={1}>
          <Header type="h4">Create a Multiparty Wallet</Header>
          <Text type="p">
            This involves multiple parties to cooperate when spending
          </Text>
          <Button onClick={() => this.create()}>Create</Button>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default withRouter(NewMultisigWallet);
