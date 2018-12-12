import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TransactionTable, Header, Table, Text } from '@bpanel/bpanel-ui';
import BoxGrid from './BoxGrid';

/*
 * general list component that renders
 * different types of lists and a header
 */
class List extends PureComponent {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      text: PropTypes.string,
      headers: PropTypes.array,
      data: PropTypes.array,
      type: PropTypes.string,
      emptyText: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      text: '',
      headers: [],
      data: [],
      type: null,
      emptyText: 'No data available...',
    };
  }

  render() {
    const { data, text, headers, type, emptyText } = this.props;
    let render;
    if (type === 'transaction')
      render = <TransactionTable transactions={data} />;
    else if (data.length)
      render = <Table colHeaders={headers} tableData={data} />;
    else render = <Text type="p">{emptyText}</Text>;

    return (
      <BoxGrid childrenClass="p-2">
        <Header type="h2">{text}</Header>
        <div>{render}</div>
      </BoxGrid>
    );
  }
}

export default List;
