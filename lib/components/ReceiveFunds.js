import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Text, Input, Button, QRCode } from '@bpanel/bpanel-ui';

class ReceiveFunds extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Text>Receive Funds</Text>
        <Text>Fresh Address</Text>
        <QRCode />
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

export default connect(mapStateToProps, mapDispatchToProps)(ReceiveFunds);
