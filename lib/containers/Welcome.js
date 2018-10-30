import React, { PureComponent } from 'react';
import { Header, Text } from '@bpanel/bpanel-ui';
import { BoxGrid } from '../components';

class Welcome extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BoxGrid colcount={1}>
        <Header type="h1">Welcome to bWallet</Header>
        <Text>we are here to help you and here is how</Text>
        <Text>copy copy copy</Text>
      </BoxGrid>
    );
  }
}

export default Welcome;
