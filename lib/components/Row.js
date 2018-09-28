import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Input, Button, Dropdown } from '@bpanel/bpanel-ui';

class Row extends PureComponent {

  static get propTypes() {
    return {
      // justify oneOf: 'left', 'right', 'center'
    }
  }

  render() {
    let { children, justify } = this.props;

    return (
      <div style={{ justifyContent: justify, textAlign: justify }} className="row">
        {children}
      </div>
    )
  }
}

export default Row;
