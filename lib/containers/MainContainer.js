import React, { PureComponent } from 'react';
import { createNestedViews } from '@bpanel/bpanel-ui';

import CreateNew from './CreateNew';
import SendReceive from './SendReceive';
import Overview from './Overview';

export default class MainContainer extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { match } = this.props;

    // TODO: figure out how to get subitems on sidebar to work
    const routes = [
      {
        path: `${match.url}/overview`,
        component: props => <Overview {...props} />,
      },
      {
        path: `${match.url}/send-receive`,
        component: props => <SendReceive {...props} />,
      },
      {
        path: `${match.url}/create`,
        component: props => <CreateNew {...props} />,
      },
    ];
    const NestedViews = createNestedViews(routes);

    // TODO: temporary just render one
    return (
      <div>
        <Overview />
      </div>
    );
  }
}
