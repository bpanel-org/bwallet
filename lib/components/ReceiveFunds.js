import React, { PureComponent } from 'react';
import { Text, Button, QRCode } from '@bpanel/bpanel-ui';
import PropTypes from 'prop-types';
import BoxGrid from './BoxGrid';
import Label from './Label';

class ReceiveFunds extends PureComponent {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      receiveAddress: PropTypes.string,
      createAddress: PropTypes.func,
      selectedAccount: PropTypes.string,
      selectedWallet: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      receiveAddress: '',
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
    const { receiveAddress, selectedAccount, selectedWallet } = this.props;
    // TODO: allow copy/paste of the address
    return (
      <BoxGrid colcount={2}>
        <BoxGrid colcount={1}>
          <Text>Receive Funds</Text>
          <Label text="Fresh Address">
            <Text>{receiveAddress}</Text>
          </Label>
          <Button onClick={() => this.new()}>New Address</Button>
        </BoxGrid>
        <BoxGrid colcount={1}>
          <QRCode text={receiveAddress} />
          <Text>
            Funds sent to this address will be received in account{' '}
            {selectedAccount} in wallet {selectedWallet}
          </Text>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default ReceiveFunds;
