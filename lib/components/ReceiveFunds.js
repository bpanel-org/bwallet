import React, { PureComponent } from 'react';
import { Text, Button, QRCode } from '@bpanel/bpanel-ui';
import PropTypes from 'prop-types';
import Box from './Box';
import Label from './Label';

class ReceiveFunds extends PureComponent {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      address: PropTypes.string,
      createAddress: PropTypes.func,
      selectedAccount: PropTypes.string,
      selectedWallet: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      address: '',
      selectedAccount: '[select account]',
      selectedWallet: '[select wallet]',
    };
  }

  // generate new receive address
  async new() {
    const { createAddress, selectedWallet, selectedAccount } = this.props;
    await createAddress(selectedWallet, selectedAccount, {
      addressType: 'receive',
    });
  }

  render() {
    const { address, selectedAccount, selectedWallet } = this.props;
    // TODO: allow copy/paste of the address
    return (
      <Box axis="vertical">
        <Box axis="horizontal" justify="left">
          <Text>Receive Funds</Text>
          <Label text="Fresh Address">
            <Text>{address}</Text>
          </Label>
          <Button onClick={() => this.new()}>New Address</Button>
        </Box>
        <Box axis="horizontal" justify="center">
          <QRCode text={address} />
          <Text>
            Funds sent to this address will be received in account{' '}
            {selectedAccount} in wallet {selectedWallet}
          </Text>
        </Box>
      </Box>
    );
  }
}

export default ReceiveFunds;
