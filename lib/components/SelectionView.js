import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Header } from '@bpanel/bpanel-ui';

/*
 * ViewButton renders a clickable
 * rectangle that drives ux
 */
class ViewButton extends PureComponent {
  static get propTypes() {
    return {
      onClick: PropTypes.function,
      header: PropTypes.string,
      text: PropTypes.string,
      icon: PropTypes.string,
    };
  }

  render() {
    return (
      <div
        className="d-flex flex-column"
        style={{ borderStyle: 'solid', padding: '4rem', cursor: 'pointer' }}
        onClick={this.props.onClick}
      >
        <Header style={{ textAlign: 'center' }} type="h1">
          {this.props.header}
        </Header>
        <Text style={{ textAlign: 'center' }} type="p">
          {this.props.text}
        </Text>
        <i
          style={{ fontSize: '4rem' }}
          className={`fa ${this.props.icon} m-auto`}
        />
      </div>
    );
  }
}

/*
 * SelectionView renders a ViewButton
 * for each props.children
 */
class SelectionView extends PureComponent {
  static get propTypes() {
    return {
      children: PropTypes.function,
    };
  }

  static get defaultProps() {
    return {
      children: [],
    };
  }

  render() {
    return (
      <div className="container row justify-content-around d-inline-flex">
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
