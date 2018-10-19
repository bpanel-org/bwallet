import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/*
 * renders text on top of children components
 */
class Label extends PureComponent {
  static get propTypes() {
    return {
      text: PropTypes.string,
      children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
      ]),
    };
  }

  render() {
    const { text, children } = this.props;
    return [
      <div key={0} style={{ width: '100%', textAlign: 'inherits' }}>
        {text}
      </div>,
      children,
    ];
  }
}

export default Label;
