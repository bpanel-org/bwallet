import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Header, utils } from '@bpanel/bpanel-ui';

import { getCardStyles } from '../style';

const { connectTheme } = utils;

/*
 * Card renders a clickable
 * rectangle that drives ux
 */
class Card extends PureComponent {
  static get propTypes() {
    return {
      onClick: PropTypes.func,
      header: PropTypes.string,
      text: PropTypes.string,
      icon: PropTypes.string,
      disabled: PropTypes.bool,
      theme: PropTypes.object,
    };
  }

  render() {
    let {
      onClick,
      theme: {
        themeVariables: { themeColors },
      },
    } = this.props;

    const style = getCardStyles(themeColors);
    let containerStyle = style.card;
    if (this.props.disabled) {
      containerStyle = Object.assign({}, containerStyle, style.disabled);
      // turn onClick function into noop
      onClick = () => {};
    }

    return (
      <div className="card" style={containerStyle} onClick={onClick}>
        <div className="card-body" style={style.body}>
          <Header style={style.text} className="card-title" type="h4">
            {this.props.header}
          </Header>
          <Text style={style.text} type="p" className="card-text">
            {this.props.text}
          </Text>
        </div>
        <div className="card-footer px-3 py-2" style={style.footer}>
          <i style={style.icon} className={`fa ${this.props.icon} m-auto`} />
        </div>
      </div>
    );
  }
}

export default connectTheme(Card);
