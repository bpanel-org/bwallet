import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Header } from '@bpanel/bpanel-ui';

class WalletsList extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // get wallets
  }

  render() {
    return (
      <div>
        <Header type="h2">Wallets List</Header>
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
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletsList);
