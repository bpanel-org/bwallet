import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Header, Table } from '@bpanel/bpanel-ui';
import { WalletsList, PendingMultisig, RecentTxList } from '../Components';

class Overview extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header type="h2">Overview</Header>
        <WalletsList type={'all'} />
        <PendingMultisig />
        <RecentTxList />
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
)(Overview);
