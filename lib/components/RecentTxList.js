import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Header } from '@bpanel/bpanel-ui';
import { TransactionTable } from '@bpanel/bpanel-ui';

class RecentTxList extends PureComponent {
  constructor(props) {
    super(props);
    this.COL_HEADERS = ['Date'];
  }

  componentDidMount() {
    // fetch transaction history
    // set as state
  }

  render() {
    return (
      <div>
        <Header type="h5">Recent Tx List</Header>
        <TransactionTable />
      </div>
    );
  }
}

const mapStateToProps = (state, otherProps) => {
  return { ...otherProps };
};

const mapDispatchToProps = dispatch => {
  return {
    undefined: async () => dispatch(),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecentTxList);