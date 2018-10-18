import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Row extends PureComponent {
  static get defaultProps() {
    return {
      onClick: () => undefined,
      style: {},
    };
  }

  // justify oneOf: 'left', 'right', 'center'
  static get propTypes() {
    return {
      style: PropTypes.object,
      justify: PropTypes.string,
      onClick: PropTypes.func,
      children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
      ]),
    };
  }

  render() {
    let { children, justify, onClick, style } = this.props;

    return (
      <div
        onClick={onClick}
        style={Object.assign(style, {
          justifyContent: justify,
          textAlign: justify,
        })}
        className="row"
      >
        {children}
      </div>
    );
  }
}

export default Row;
