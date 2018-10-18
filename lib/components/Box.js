import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/*
 * general box component that can render children
 * vertical mode:
 *   renders a single row with each child in a column
 * horizontal mode:
 *   renders each child in a row
 * merges any prop styles into styles object
 */
class Box extends PureComponent {
  static get propTypes() {
    return {
      axis: PropTypes.oneOf(['vertical', 'horizontal']),
      children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
      ]),
      justify: PropTypes.string,
      onClick: PropTypes.func,
      style: PropTypes.object,
      paddingTop: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      onClick: () => undefined,
      paddingTop: '0rem',
      margin: 'auto',
      style: {},
    };
  }

  definedOrNull(object) {
    return object || object === null;
  }

  /*
   * merges any style props into the style object
   * also merges in null values so that defaults can
   * be removed
   */
  reduceStyle() {
    const { paddingTop, margin } = this.props;
    let { style, paddingTop, margin } = this.props;

    if (this.definedOrNull(paddingTop))
      style.paddingTop = paddingTop;

    if (this.definedOrNull(margin))
      style.margin = margin;

    return style;
  }

  render() {
    const { axis, children, justify, onClick } = this.props;

    const style = reduceStyle();

    if (axis === 'vertical') {

      /*
       * render each child into a column
       * NOTE: don't pass too many children
       */

      let len;
      if (Array.isArray(children)) len = children.length;
      else if (children) len = 1;
      else len = 12;

      const colSize = `col-md-${12 / len}`;
      return (
        <div style={style} className="row">
          {React.Children.map(children, (child, i) => {
            return (
              <div key={i} className={colSize}>
                {child}
              </div>
            );
          })}
        </div>
      );

    } else if (axis === 'horizontal') {

      /*
       * render each child into a row
       */
      return React.Children.map(children, (child, i) => {
        return (
          <div className="row" key={i} style={style} onClick={onClick} justify={justify}>
            {child}
          </div>
        )
      });
    }
  }
}

export default Box;

