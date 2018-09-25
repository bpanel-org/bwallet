import React, { PureComponent } from 'react';
import { Text, Header } from '@bpanel/bpanel-ui';

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
    const style = { 'justifyContent': 'space-around' };
    return (
      <div className="row" style={style}>
        {selection.map((s, i) => {
          console.log(s)
          return (
            <div key={i} onClick={() => select(s.click[0], s.click[1])}>
              <Header type="h3">{s.header}</Header>
              <Text>{s.text}</Text>
              <i className={`fa ${s.icon}`} />
            </div>
          );
        })}
      </div>
    );
  }
}

export default SelectStep;

