import React, { PureComponent } from 'react';
import { Header, createNestedViews } from '@bpanel/bpanel-ui';

import CreateNew from './CreateNew';
import SendReceive from './SendReceive';
import Overview from './Overview';

export default class MainContainer extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { match } = this.props;

    const routes = [
      { path: `${match.url}/overview`, component: props => <Overview {...props} />},
      { path: `${match.url}/send-receive`, component: props => <SendReceive {...props} />},
      { path: `${match.url}/create`, component: props => <CreateNew {...props} />},
    ];
    const NestedViews = createNestedViews(routes);

    return (
      <div>
        <Header type="h2">Wallet Overview</Header>
        <NestedViews />
      </div>
    );
  }
}

