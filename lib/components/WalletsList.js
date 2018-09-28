import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header, Table } from '@bpanel/bpanel-ui';
import TerminalView from './TerminalView';

// TODO: how to keep one source of truth for headers?
class WalletsList extends PureComponent {
  constructor(props) {
    super(props);
    this.COL_HEADERS = ['Name', 'Balance', 'Watch Only', 'Multi-Party'];
  }

  static get propTypes() {
    return {
      walletsList: PropTypes.array,
    };
  }

  static get defaultProps() {
    return {
      walletsList: [],
    };
  }

  render() {
    const { walletsList } = this.props;
    return (
      <TerminalView>
        <div>
          <Header type="h5">Wallets List</Header>
          <Table colHeaders={this.COL_HEADERS} tableData={walletsList} />
        </div>
      </TerminalView>
    );
  }
}

export default WalletsList;
