import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Text, Header, Button, Dropdown } from '@bpanel/bpanel-ui';
import { TerminalView, Box, Row, Label, List } from '../components';

import { walletInfo } from '../mappings';

const ACCOUNTS_LIST_HEADERS = ['Name', 'Balance', 'Address', 'Watch Only'];

class WalletInfo extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      createAccountView: false,
    };
  }

  componentDidMount() {
    const { selectWallet, selectedWallet, match } = this.props;

    /*
     * depends on uri schema:
     * /bwallet/wallets/:type/:wallet
     */
    const { params } = match;
    const { type, wallet } = params;

    // only select wallet if it has yet to be selected
    // this prevents an infinite loop
    if (selectedWallet !== wallet) selectWallet(wallet, type);
  }

  static get propTypes() {
    return {
      match: PropTypes.object.isRequired,
      selectWallet: PropTypes.func,
      selectedWallet: PropTypes.string,
      accounts: PropTypes.array,
      history: PropTypes.object, // react-router history
    };
  }

  static get defaultProps() {
    return {
      accounts: [],
    };
  }

  async toggle(key) {
    await this.setState({
      [key]: !this.state[key],
    });
  }

  navigate() {
    const { history, match } = this.props;
    const { params } = match;
    const { wallet } = params;

    // navigate to multisig complete page
    history.push(`/bwallet/send-receive/${wallet}`);
    history.goForward();
  }

  render() {
    const { selectedWallet, accounts } = this.props;

    return (
      <TerminalView>
        <Box justify="space-around">
          <Header type="h2">{selectedWallet}</Header>
          <Box justify="space-around">
            <Label text="Balance">
              <Text type="p">test</Text>
            </Label>
            <Label text="Accounts">
              <Text>test</Text>
            </Label>
            <Label text="Transactions">
              <Text>test</Text>
            </Label>
          </Box>
          <Box>
            <Label text="Accounts">
              <Dropdown options={[]} />
            </Label>
            <Text>Balance: test</Text>
          </Box>
          <Row>
            <Button onClick={() => console.log('not implemented')}>
              Details
            </Button>
            <Button onClick={() => this.navigate()}>Send/Receive</Button>
            <Button onClick={() => this.toggle('createAccountView')}>
              Add Account
            </Button>
          </Row>
          <List
            text="Accounts Overview"
            headers={ACCOUNTS_LIST_HEADERS}
            data={accounts}
          />
          <List type="transaction" text="Recent Tx List" />
        </Box>
      </TerminalView>
    );
  }
}

export default connect(
  walletInfo.mapStateToProps,
  walletInfo.mapDispatchToProps
)(withRouter(WalletInfo));
