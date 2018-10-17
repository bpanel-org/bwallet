import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Input, Button, Dropdown } from '@bpanel/bpanel-ui';

class Row extends PureComponent {
  static get propTypes() {
    return {
      // justify oneOf: 'left', 'right', 'center'
    };
  }

  static get defaultProps() {
    return {
      onClick: () => undefined,
    };
  }

  render() {
    let { children, justify, onClick, style } = this.props;

    return (
      <div
        style={style}
        onClick={onClick}
        style={{ justifyContent: justify, textAlign: justify }}
        className="row"
      >
        {children}
      </div>
    );
  }
}

export default Row;
