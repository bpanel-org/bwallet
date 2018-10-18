import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Row from './Row';

class Box extends PureComponent {
  static get propTypes() {
    return {
      children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
      ]),
      justify: PropTypes.string,
      onClick: PropTypes.func,
      style: PropTypes.object,
    };
  }

  static get defaultProps() {
    return {
      onClick: () => undefined,
    };
  }

  render() {
    let { children, justify, onClick, style } = this.props;

    return React.Children.map(children, (child, i) => {
      return (
        <Row key={i} style={style} onClick={onClick} justify={justify}>
          {child}
        </Row>
      );
    });
  }
}

export default Box;
