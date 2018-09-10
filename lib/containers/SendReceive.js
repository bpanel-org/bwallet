import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Header } from '@bpanel/bpanel-ui';

class SendReceive extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header type="h2">Send Receive</Header>
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

export default connect(mapStateToProps, mapDispatchToProps)(SendReceive);
