import React, { PureComponent } from 'react';
import { Header } from '@bpanel/bpanel-ui';
import { TransactionTable } from '@bpanel/bpanel-ui';
import TerminalView from './TerminalView';

class RecentTxList extends PureComponent {
  constructor(props) {
    super(props);
    this.COL_HEADERS = ['Date'];
  }

  render() {
    return (
      <TerminalView>
        <div>
          <Header type="h5">Recent Tx List</Header>
          <TransactionTable />
        </div>
      </TerminalView>
    );
  }
}

export default RecentTxList;
