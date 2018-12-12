import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';

/*
 * general box component that can render children
 * in rows and columns
 * colcount prop determines number of columns per row
 */
class BoxGrid extends PureComponent {
  static get propTypes() {
    return {
      colcount: PropTypes.number,
      rowClass: PropTypes.string,
      colClass: PropTypes.string,
      children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
      ]),
      onClick: PropTypes.func,
      theme: PropTypes.object,
      childrenClass: PropTypes.string,
      style: PropTypes.object,
    };
  }

  /*
   * more specific bootstrap col classes will overwrite col
   */
  static get defaultProps() {
    return {
      colcount: 1,
      rowClass: '',
      colClass: '',
      theme: {},
      style: {},
    };
  }

  render() {
    const {
      children,
      theme,
      colcount,
      rowClass,
      colClass,
      childrenClass,
      style,
    } = this.props;

    // handle case when only a single child
    const childElements = React.Children.toArray(children);
    const chunks = chunk(childElements, colcount);

    return chunks.map((chunk, i) => {
      return (
        <div
          key={i}
          style={style}
          className={`row ${rowClass} ${theme.box || ''}`}
        >
          {chunk.map((Child, j) => {
            return (
              <div key={j} className={`col ${colClass}`}>
                {/* only clone the react element if childrenClass prop is present */}
                {childrenClass
                  ? React.cloneElement(Child, { className: childrenClass })
                  : Child}
              </div>
            );
          })}
        </div>
      );
    });
  }
}

export default BoxGrid;
