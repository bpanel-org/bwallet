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
      balance: PropTypes.string,
      type: PropTypes.string,
      icon: PropTypes.string,
      watchOnly: PropTypes.bool,
      disabled: PropTypes.bool,
      encrypted: PropTypes.bool,
      theme: PropTypes.object,
    };
  }

  render() {
    let {
      onClick,
      header,
      balance = '0.0',
      type,
      encrypted = false,
      watchOnly = true,
      icon,
      theme: { themeVariables },
    } = this.props;

    const style = getCardStyles(themeVariables);
    let containerStyle = style.card;
    if (this.props.disabled) {
      containerStyle = Object.assign({}, containerStyle, style.disabled);
      // turn onClick function into noop
      onClick = () => {};
    }
    const cardClasses = 'col-lg-3 col-md-6 mb-3 mb-lg-0';
    if (header === 'Add New')
      return (
        <div className={cardClasses} style={containerStyle} onClick={onClick}>
          <div className="h-100 d-flex align-items-center" style={style.addNew}>
            <div className="col">
              <i style={style.icon} className="fa fa-plus m-auto" />
              <Header style={style.text} className="card-title" type="h6">
                {header}
              </Header>
            </div>
          </div>
        </div>
      );
    return (
      <div className={cardClasses} style={containerStyle} onClick={onClick}>
        <div
          className="card-body h-75  d-flex align-items-center"
          style={style.body}
        >
          <div className="col">
            <Header style={style.title} className="card-title" type="h5">
              {header}
            </Header>
            <Text type="p">
              <span style={style.balance}>{balance.toUpperCase()}</span>
            </Text>
          </div>
          <Text style={style.textFooter} type="p" className="align-self-end">
            {type}
          </Text>
        </div>
        <div className="h-25 no-gutters row" style={style.footer}>
          <i style={style.icon} className={`fa ${icon} m-auto`} title={type} />
          {watchOnly ? (
            <i
              style={style.icon}
              className={`fa fa-eye m-auto`}
              title="Watch Only"
            />
          ) : (
            <i
              style={style.icon}
              className={`fa fa-angle-double-up m-auto`}
              title="Interactive Wallet"
            />
          )}
          {encrypted ? (
            <i
              style={style.icon}
              className={`fa fa-lock m-auto`}
              title="Encrypted"
            />
          ) : (
            <i
              style={style.icon}
              className={`fa fa-unlock m-auto`}
              title="Unencrypted"
            />
          )}
        </div>
      </div>
    );
  }
}

export default connectTheme(Card);
