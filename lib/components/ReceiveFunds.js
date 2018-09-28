import React, { PureComponent } from 'react';
import { Text, Button, QRCode } from '@bpanel/bpanel-ui';
import TerminalView from './TerminalView';
import Box from './Box'

class ReceiveFunds extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TerminalView>
        <Box justify="left">
          <Text>Receive Funds</Text>
          <Text>Fresh Address</Text>
          <Button>Create</Button>
        </Box>
        <Box justify="center">
          <QRCode />
        </Box>
      </TerminalView>
    );
  }
}

export default ReceiveFunds;
