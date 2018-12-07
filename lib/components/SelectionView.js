import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ViewButton from './ViewButton';

/*
 * SelectionView renders a ViewButton
 * for each props.children
 */
class SelectionView extends PureComponent {
  static get propTypes() {
    return {
      children: PropTypes.array,
    };
  }

  static get defaultProps() {
    return {
      children: [],
    };
  }

  render() {
    return (
      <div className="container row justify-content-around d-inline-flex flex-wrap">
        {this.props.children.map((child, i) => {
          const { props } = child;
          return (
            <ViewButton
              key={i}
              {...props}
              onClick={() => this.props.onClick(child)}
            />
          );
        })}
      </div>
    );
  }
}

export default SelectionView;
