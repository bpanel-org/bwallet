import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Header, Table } from '@bpanel/bpanel-ui';

class WalletsList extends PureComponent {
  constructor(props) {
    super(props);
    this.COL_HEADERS = ['Name', 'Balance', 'Watch-Only', 'Multi-Sig'];
  }

  componentDidMount() {
    // fetch wallets based on:
    // this.props.type
    // set them as state
  }

  render() {
    // pass wallets into table
    // list of string or list of obj
    // string expects one key val pair in object
    // Table.mapColumns(list, {key-in-list-obj, value-to-map-to})
    return (
      <div>
        <Header type="h5">Wallets List</Header>
        <Table
          colHeaders={this.COL_HEADERS}
          tableData={[]}
        />
      </div>
    );
  }
}

// filter wallets based on type
// get type from otherProps
const mapStateToProps = (state, otherProps) => {
  return { ...otherProps };
};

// pass getWallets into here
const mapDispatchToProps = dispatch => {
  return {
    undefined: async () => dispatch(),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletsList);
