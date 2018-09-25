import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Header } from '@bpanel/bpanel-ui';
import { selectStep as style } from '../style';

class SelectStep extends PureComponent {
  constructor(props) {
    super(props);
  }

  /* selection schema
   * [{
   *    header: '',
   *    text: '',
   *    icon: '',
   *    click: ['', '']
   * }]
   */
  static get defaultProps() {
    return {
      selection: [],
    };
  }

  static get propTypes() {
    return {
      selection: PropTypes.array,
      select: PropTypes.func,
    };
  }

  render() {
    const { selection } = this.props;
    let { select } = this.props;
    let itemContainer = style.itemContainer;
    return (
      <div className="row" style={style.container}>
        {selection.map((s, i) => {

          let onclick = select;
          // buttons can be disabled
          // change onclick to noop and style container as disabled
          if (!s.enabled) {
            itemContainer = Object.assign({}, style.itemContainer, style.disabled);
            onclick = () => {};
          }

          return (
            <div
              key={i}
              style={itemContainer}
              onClick={() => onclick(s.click[0], s.click[1])}
            >
              <div style={style.iconContainer} className="row">
                <i style={style.icon} className={`fa ${s.icon}`} />
              </div>
              <div style={style.rowContainer} className="row">
                <Header type="h3">{s.header}</Header>
              </div>
              <div style={style.rowContainer} className="row">
                <Text>{s.text}</Text>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default SelectStep;
