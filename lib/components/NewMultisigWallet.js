import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Input, Button, Dropdown, Header } from '@bpanel/bpanel-ui';
import BoxGrid from './BoxGrid';
import Label from './Label';

const MAX_MULTISIG = 15;

class NewMultisigWallet extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      multisigWalletName: '',
      m: '',
      n: '',
    };
    this.dropdownOptions = [];
    for (let i = 1; i <= MAX_MULTISIG; i++) this.dropdownOptions.push(`${i}`);
  }

  static get propTypes() {
    return {
      createWallet: PropTypes.func,
    };
  }

  create(name) {
    console.log(`Unimplemented: ${name}`);

    return;

    // eslint-disable-next-line no-unreachable
    const { createWallet } = this.props;
    const { multisigWalletName } = this.state;
    const options = {};
    createWallet(multisigWalletName, options, 'multisig');
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
          <Label className="d-flex align-items-start" text="Wallet Name">
            <Input
              className="col"
              name="multisigWalletName"
              placeholder="Wallet Name"
              onChange={e => this.update('multisigWalletName', e.target.value)}
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
            text="Number of Participants (M)"
          >
            <Dropdown
              defaultValue="1"
              options={this.dropdownOptions}
              onChange={({ value }) => this.update('n', value)}
            />
          </Label>
        </BoxGrid>
        <BoxGrid colcount={1}>
          <Text>About</Text>
          <Button onClick={() => this.create(this.state.multisigWalletName)}>
            Create
          </Button>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default NewMultisigWallet;
