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
      width: PropTypes.string,
      onClick: PropTypes.func,
      style: PropTypes.object,
      paddingTop: PropTypes.string,
      margin: PropTypes.string,
      theme: PropTypes.object,
      flexGrow: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      axis: 'horizontal',
      onClick: () => undefined,
      paddingTop: '0rem',
      margin: 'auto',
      flexGrow: '100',
      style: {},
      theme: {},
      breakpoint: '',
      justify: '',
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
    const { paddingTop, margin, width, flexGrow, justify } = this.props;
    let { style } = this.props;

    if (this.definedOrNull(paddingTop)) style.paddingTop = paddingTop;

    if (this.definedOrNull(margin)) style.margin = margin;

    if (this.definedOrNull(width)) style.width = width;

    if (this.definedOrNull(flexGrow)) style.flexGrow = flexGrow;

    if (this.definedOrNull(justify)) style.justifyContent = justify;

    return style;
  }

  render() {
    const { axis, children, theme, onClick } = this.props;

    const style = this.reduceStyle();

    if (axis === 'vertical') {
      /*
       * render each child into a column
       */

      return (
        <div style={style} className={`row ${theme.box}`}>
          {React.Children.map(children, (child, i) => {
            return (
              <div key={i} style={{ flexGrow: 'inherits' }} className="col-md">
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
          <div
            className={`row ${theme.box}`}
            key={i}
            style={style}
            onClick={onClick}
          >
            {child}
          </div>
        );
      });
    }
  }
}

export default Box;
