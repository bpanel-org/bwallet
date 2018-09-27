import React, { PureComponent } from 'react';
import { Header, Table } from '@bpanel/bpanel-ui';
import PropTypes from 'prop-types';

class PendingMultiparty extends PureComponent {
  constructor(props) {
    super(props);
    this.COL_HEADERS = ['Name', 'M of N', 'Progress'];
  }

  static get propTypes() {
    return {
      pendingMultiparty: PropTypes.array,
    };
  }

  static get defaultProps() {
    return {
      pendingMultiparty: [],
    };
  }

  render() {
    const { pendingMultiparty } = this.props;
    return (
      <div>
        <Header type="h5">Pending Multiparty Wallets</Header>
        <Table colHeaders={this.COL_HEADERS} tableData={pendingMultiparty} />
      </div>
    );
  }
}

export default PendingMultiparty;
