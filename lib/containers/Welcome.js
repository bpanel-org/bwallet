import React, { PureComponent } from 'react';
import { Header, Text } from '@bpanel/bpanel-ui';

class Welcome extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header type="h1">Welcome to bWallet</Header>
        <div className="row">
          <Text>we are here to help you and here is how</Text>
        </div>
        <div className="row">
          <Text>copy copy copy</Text>
        </div>
      </div>
    );
  }
}

export default Welcome;

