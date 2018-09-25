import React, { PureComponent } from 'react';
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
    }
  }

  render() {
    const { select, selection } = this.props;
    return (
      <div className="row" style={style.container}>
        {selection.map((s, i) => {
          return (
            <div key={i} style={style.itemContainer} onClick={() => select(s.click[0], s.click[1])}>
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

