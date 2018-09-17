import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, Table } from '@bpanel/bpanel-ui';

// TODO: how to keep one source of truth for headers?
class WalletsList extends PureComponent {
  constructor(props) {
    super(props);
    this.COL_HEADERS = ['Name', 'Balance', 'Watch Only', 'Multi-Sig'];
  }

  static get propTypes() {
    return {
      wallets: PropTypes.array,
    }
  }

  static get defaultProps() {
    return {
      walletsList: [],
    }
  }

  render() {
    const { walletsList } = this.props;
    return (
      <div>
        <Header type="h5">Wallets List</Header>
        <Table
          colHeaders={this.COL_HEADERS}
          tableData={walletsList}
        />
      </div>
    );
  }
}

export default WalletsList;
