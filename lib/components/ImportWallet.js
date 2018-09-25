import React, { PureComponent } from 'react';
import { Text, Input, Button } from '@bpanel/bpanel-ui';

class ImportWallet extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Text>mnemonic</Text>
        <Input name={''} />
        <Text>Local File</Text>
        <Button>Import</Button>

      </div>
    );
  }
}

export default ImportWallet;
