import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// TODO: rename to Container
class TerminalView extends PureComponent {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
      ]).isRequired,
      paddingTop: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      paddingTop: '0rem',
    };
  }

  render() {
    const { children, paddingTop } = this.props;

    /*
     * render children into a single row
     * each gets own column
     * NOTE: don't pass too many children
     */

    let len;
    if (Array.isArray(children)) len = children.length;
    else if (children) len = 1;
    else len = 12;

    const rowSize = `col-md-${12 / len}`;
    return (
      <div style={{ margin: 'auto', paddingTop }} className="container">
        <div className="row">
          {React.Children.map(children, (child, i) => {
            return (
              <div key={i} className={rowSize}>
                {child}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default TerminalView;
