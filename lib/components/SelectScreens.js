import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Header } from '@bpanel/bpanel-ui';
import { selectStep as style } from '../style';
import Box from './Box';
import Row from './Row';
import TerminalView from './TerminalView';

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
      <TerminalView>
        {selection.map((s, i) => {
          let onclick = select;
          // buttons can be disabled
          // change onclick to noop and style container as disabled
          if (!s.enabled) {
            itemContainer = Object.assign(
              {},
              style.itemContainer,
              style.disabled
            );
            onclick = () => {};
          }

          return (
              <Box key={i} justify="center" onClick={() => onclick(s.click[0], s.click[1])}>
                <div style={itemContainer}>
                  <i style={style.icon} className={`fa ${s.icon}`} />
                  <Header type="h3">{s.header}</Header>
                  <Text>{s.text}</Text>
                </div>
              </Box>
          );
        })}
      </TerminalView>
    );
  }
}

export default SelectStep;
