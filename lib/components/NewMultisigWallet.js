import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Input, Button, Dropdown, Header } from '@bpanel/bpanel-ui';
import TerminalView from './TerminalView';

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
    const { state } = this;
    this.setState(
      Object.assign({}, state, {
        [key]: value,
      })
    );
  }

  render() {
    return (
      <TerminalView>
        <div>
          <Header type="h2">Multisig</Header>
          <div className="row">
            <Input
              name="multisigWalletName"
              placeholder="Wallet Name"
              onChange={e => this.update('multisigWalletName', e.target.value)}
            />
          </div>

          <div className="row">
            <Text>Signatures Required (M)</Text>
            <Dropdown
              defaultValue="1"
              options={this.dropdownOptions}
              onChange={({ value }) => this.update('m', value)}
            />
          </div>

          <div className="row">
            <Text>Number of Participants (N)</Text>
            <Dropdown
              defaultValue="1"
              options={this.dropdownOptions}
              onChange={({ value }) => this.update('n', value)}
            />
          </div>
        </div>
        <div>
          <Text>About</Text>
          <Button onClick={() => this.create(this.state.multisigWalletName)}>
            Create
          </Button>
        </div>
      </TerminalView>
    );
  }
}

export default NewMultisigWallet;
