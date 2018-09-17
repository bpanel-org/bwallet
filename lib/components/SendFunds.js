import React, { PureComponent } from 'react';
import { Text, Input, Button } from '@bpanel/bpanel-ui';

class SendFunds extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Input name={'amount'} />
        <Input name={'address'} />
        <Input name={'password'} />
        <Text>You are sending...</Text>
        <Button>Send</Button>
      </div>
    );
  }
}

export default SendFunds;
