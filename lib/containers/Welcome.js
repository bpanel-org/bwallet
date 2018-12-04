import React, { PureComponent } from 'react';
import { Header, Text } from '@bpanel/bpanel-ui';
import { BoxGrid } from '../components';

class Welcome extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BoxGrid rowClass="text-center" colClass="m-auto" colcount={2}>
        <div>
          <Header type="h1">bWallet</Header>
          <Header type="h3">Don&#39;t Trust, Verify</Header>
        </div>
        <div>
          <Text type="p">bwallet is open source</Text>
          <Text type="p">contribute!</Text>
        </div>
      </BoxGrid>
    );
  }
}

export default Welcome;
