import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text } from '@bpanel/bpanel-ui';

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
      className: PropTypes.string,
      theme: PropTypes.object,
    };
  }

  static get defaultProps() {
    return {
      className: '',
      theme: {},
      style: {},
    };
  }

  render() {
    const { text, children, className, theme, style } = this.props;
    return [
      <div
        key={0}
        className={`${theme.label} ${className}`}
        style={Object.assign({ width: '100%' }, style)}
      >
        <Text>{text}</Text>
      </div>,
      children,
    ];
  }
}

export default Label;
