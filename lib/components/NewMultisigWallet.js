import React, { PureComponent } from 'react';
import { Text, Input, Button } from '@bpanel/bpanel-ui';

class NewMultisigWallet extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Text>Multisig</Text>
        <Input />
        <Button>Create</Button>
      </div>
    );
  }
}

export default NewMultisigWallet;
