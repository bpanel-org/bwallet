import React, { PureComponent } from 'react';

class Label extends PureComponent {
  render() {
    const { text, children } = this.props;
    return [
      <div key={0} style={{ width: '100%', textAlign: 'inherits' }}>
        {text}
      </div>,
      children,
    ];
  }
}

export default Label;
