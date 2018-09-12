import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Text, Input, Button } from '@bpanel/bpanel-ui';

class NewWallet extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Text>Hardware Wallet</Text>
        <Text>Watch Only?</Text>
        <Text>Encrypt with Passphrase?</Text>
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
)(NewWallet);
