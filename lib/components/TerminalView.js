import React, { PureComponent } from 'react';
import { Text, Input, Button, Header } from '@bpanel/bpanel-ui';

class TerminalView extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { children } = this.props;

    /*
     * Making the assumption that the terminal view
     * only has 2 children
     */

    return (
      <div className="container">
        <div className="row">
          {React.Children.map(children, child => {
            return (
              <div className="col-md-6">
                {child}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default TerminalView;

