import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Text, Input, Button } from '@bpanel/bpanel-ui';

class ImportWallet extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Text>mnemonic</Text>
        <Input name={''} />
        <Text>Local File</Text>
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
)(ImportWallet);
