import React, { PureComponent } from 'react';
import { Text, Button, QRCode } from '@bpanel/bpanel-ui';

class ReceiveFunds extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Text>Receive Funds</Text>
        <Text>Fresh Address</Text>
        <Button>Create</Button>
        <QRCode />
      </div>
    );
  }
}

export default ReceiveFunds;
