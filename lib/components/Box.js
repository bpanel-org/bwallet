import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Input, Button, Dropdown } from '@bpanel/bpanel-ui';
import Row from './Row';

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
        <Row key={i} justify={justify}>
          {child}
        </Row>
      )
    });
  }
}

export default Box;
