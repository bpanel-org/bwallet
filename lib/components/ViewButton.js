import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Header } from '@bpanel/bpanel-ui';

import { viewButton as style } from '../style';

/*
 * ViewButton renders a clickable
 * rectangle that drives ux
 */
class ViewButton extends PureComponent {
  static get propTypes() {
    return {
      onClick: PropTypes.func,
      header: PropTypes.string,
      text: PropTypes.string,
      icon: PropTypes.string,
      disabled: PropTypes.bool,
    };
  }

  render() {
    let { onClick } = this.props;

    let containerStyle = style.base;
    if (this.props.disabled) {
      containerStyle = Object.assign({}, containerStyle, style.disabled);
      // turn onClick function into noop
      onClick = () => {};
    }

    return (
      <div
        className="d-flex flex-column flex-fill"
        style={containerStyle}
        onClick={onClick}
      >
        <Header style={style.text} type="h1">
          {this.props.header}
        </Header>
        <Text style={style.text} type="p">
          {this.props.text}
        </Text>
        <i style={style.icon} className={`fa ${this.props.icon} m-auto`} />
      </div>
    );
  }
}

export default ViewButton;
