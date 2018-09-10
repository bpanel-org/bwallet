import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Header } from '@bpanel/bpanel-ui';

class CreateNew extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header type="h2">Create New</Header>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateNew);

