import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Text, Input, Button } from '@bpanel/bpanel-ui';

class NewMultisigWallet extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Text>Multisig</Text>
        <Input />
        <Button>Create</Button>
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
)(NewMultisigWallet);
