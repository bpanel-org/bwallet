import React, { PureComponent } from 'react';
import { Text, Input, Button } from '@bpanel/bpanel-ui';
import TerminalView from './TerminalView';

class WatchOnly extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TerminalView>
        <div>
          <Text>Watch Only</Text>
          <Input name={''} />
          <Button>Import</Button>
        </div>
      </TerminalView>
    );
  }
}

export default WatchOnly;

