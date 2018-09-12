import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Header, Table } from '@bpanel/bpanel-ui';

class PendingMultisig extends PureComponent {
  constructor(props) {
    super(props);
    this.COL_HEADERS = ['Name', 'Date', 'M of N', 'Init'];
  }

  componentDidMount() {
    // fetch multisig wallets
    // filter to partially initialized
    // set as state
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
)(PendingMultisig);
