import React, { PureComponent } from 'react';
import { Header } from '@bpanel/bpanel-ui';

export default class MainContainer extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header type="h2">Wallet Dashboard</Header>
      </div>
    );
  }
}
