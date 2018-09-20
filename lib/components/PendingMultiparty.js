import React, { PureComponent } from 'react';
import { Header, Table } from '@bpanel/bpanel-ui';

class PendingMultiparty extends PureComponent {
  constructor(props) {
    super(props);
    this.COL_HEADERS = ['Name', 'Date', 'M of N', 'Init'];
  }

  render() {
    return (
      <div>
        <Header type="h5">Pending Multiparty Wallets</Header>
        <Table colHeaders={this.COL_HEADERS} tableData={[]} />
      </div>
    );
  }
}

export default PendingMultiparty;
