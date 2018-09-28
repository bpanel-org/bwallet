import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Input, Button, Dropdown } from '@bpanel/bpanel-ui';

class Box extends PureComponent {

  static get propTypes() {
    return {
      // justify oneOf: 'left', 'right', 'center'
    }
  }

  render() {
    let { children, justify } = this.props;

    return React.Children.map(children, (child, i) => {
      return (
        <div key={i} style={{ justifyContent: justify, textAlign: justify }} className="row">
          {child}
        </div>
      )
    });
  }
}

export default Box;
