import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Input, Button } from '@bpanel/bpanel-ui';

class SendFunds extends PureComponent {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      ticker: PropTypes.string,
      selectedWallet: PropTypes.string,
      selectedAccount: PropTypes.string,
    }
  }

  static get defaultProps() {
    return {
      ticker: 'BTC',
    };
  }

  send() {
    console.log('Not implemented!')
  }

  render() {
    const { ticker, selectedWallet, selectedAccount } = this.props;
    // TODO: if there is no selected wallet and account,
    // render the bottom without being usable
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="row">
              <Input
                name={'amount'}
                placeholder="Amount"
              />
            </div>
            <div className="row">
              <Input
                name={'address'}
                placeholder={`${ticker} Address`}
              />
            </div>
            <div className="row">
            <Input
              name={'password'}
              placeholder="Passphrase"
            />
            </div>
            <div className="row">
              <Button onClick={() => this.send()}>
                Send
              </Button>
            </div>
          </div>
          <div className="col-md-6">
            <Text>
              You are sending xxx {ticker} (yyy currency)
              to ... from {selectedAccount} in {selectedWallet}
            </Text>
          </div>
        </div>
      </div>
    );
  }
}

export default SendFunds;
