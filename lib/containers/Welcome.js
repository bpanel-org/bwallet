import React, { PureComponent } from 'react';
import { Header, Text } from '@bpanel/bpanel-ui';
import { TerminalView, Box } from '../components';

class Welcome extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TerminalView>
        <Box justify="center">
          <Header type="h1">Welcome to bWallet</Header>
          <Text>we are here to help you and here is how</Text>
          <Text>copy copy copy</Text>
        </Box>
      </TerminalView>
    );
  }
}

export default Welcome;
