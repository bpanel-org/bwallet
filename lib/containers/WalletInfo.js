import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Text, Header, Button, Dropdown, Link, Input } from '@bpanel/bpanel-ui';
import { BoxGrid, Label, List } from '../components';
import { WALLET_INFO_ACCOUNTS_LIST_HEADERS } from '../constants/bwallet';
import { walletInfo } from '../mappings';

class WalletInfo extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      createAccountView: false,
      accountId: '',
      passphrase: '',
    };
  }

  componentDidMount() {
    const {
      selectWallet,
      selectAccount,
      selectedWallet,
      selectedAccount,
      accounts,
      match,
    } = this.props;

    /*
     * depends on uri schema:
     * /bwallet/wallets/:type/:wallet
     */
    const { params } = match;
    const { type, wallet } = params;

    // only select wallet if it has yet to be selected
    // this prevents an infinite loop
    if (selectedWallet !== wallet) selectWallet(wallet, type);

    // reset to default account if selected account
    // isn't part of currently selected wallet's accounts
    if (selectedWallet && !accounts.includes(selectedAccount))
      selectAccount(selectedWallet, 'default', true);
  }

  static get propTypes() {
    return {
      match: PropTypes.object.isRequired,
      selectWallet: PropTypes.func,
      selectedWallet: PropTypes.string,
      accounts: PropTypes.array,
      history: PropTypes.object, // react-router history
      accountOverviewList: PropTypes.array,
      selectedWalletInfo: PropTypes.object,
      selectAccount: PropTypes.func,
      selectedAccount: PropTypes.string,
      txhistory: PropTypes.array,
    };
  }

  static get defaultProps() {
    return {
      accounts: [],
      selectedWalletInfo: {
        balance: {},
      },
      selectedAccountInfo: {
        balance: {},
      }
    };
  }

  toggle(key) {
    this.setState({ [key]: !this.state[key] });
  }

  update(key, value) {
    this.setState({ [key]: value });
  }

  async createAccount() {
    const { createAccount, selectedWallet } = this.props;
    const { accountId, passphrase } = this.state;

    // TODO: better way to alert user
    if (accountId === '') {
      alert('please enter account name');
      return;
    }

    if (passphrase === '') {
      alert('enter wallet passphrase');
      return;
    }

    // TODO: figure out proper options
    // final bool arg refetches wallet accounts if true
    // TODO: allow for witness selector
    await createAccount(selectedWallet, accountId, {
      passphrase,
    }, true);
  }

  selectAccount(accountId) {
    const { selectedWallet, selectAccount } = this.props;

    // third argument is a bool to fetch history of account
    selectAccount(selectedWallet, accountId, true);
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
    const {
      selectedWallet,
      selectedAccount,
      accounts,
      accountOverviewList,
      selectedWalletInfo,
      txhistory,
      selectedAccountInfo,
    } = this.props;

    const { createAccountView } = this.state;

    // TODO: handle coin ticker
    return (
      <BoxGrid colcount={1}>
        <BoxGrid colClass="d-flex align-items-start" colcount={1}>
          <Header type="h2">{selectedWallet}</Header>
          <BoxGrid rowClass="pr-4" colcount={1}>
            <Label text="Balance">
              <Text type="p">{selectedWalletInfo.balance.confirmed}</Text>
            </Label>
            <Label text="Accounts">
              <Text>{accounts.length}</Text>
            </Label>
            <Label text="Transactions">
              <Text>{selectedWalletInfo.balance.tx}</Text>
            </Label>
          </BoxGrid>
        </BoxGrid>
        <BoxGrid colcount={1}>
          <BoxGrid colcount={1}> {/* child of this conditional */}
            {!createAccountView &&
              <div>
                <BoxGrid colClass="m-auto" rowClass="pb-4" colcount={2}>
                  <Label text="Accounts">
                    <Dropdown
                      options={accounts}
                      onChange={({ value }) => this.selectAccount(value)}
                      placeholder={selectedAccount || 'Select Account'}
                    />
                  </Label>
                  <Text>Balance: {selectedAccountInfo.balance.confirmed}</Text>
                </BoxGrid>
                <div className="d-flex align-items-start">
                  <Button
                    className="mr-3 mb-3 p-2"
                    onClick={() => console.log('not implemented')}
                  >
                    Details
                  </Button>
                  <Button className="mr-3 mb-3 p-2" onClick={() => this.navigate()}>
                    Send/Receive
                  </Button>
                  <span className="flex-grow-1" />
                  <Button
                    className="mr-3 mb-3 p-2"
                    onClick={() => this.toggle('createAccountView')}
                  >
                    Add Account
                  </Button>
                  <span className="flex-grow-1" />
                </div>
              </div>
            }
            {createAccountView &&
              <BoxGrid colClass="m-auto" rowClass="pb-4" colcount={4}>
                <Label text="Account Name">
                  <Input
                    className="col"
                    placeholder="Account Name"
                    name="accountId"
                    onChange={e => this.update('accountId', e.target.value)}
                  />
                </Label>
                <Label text="Passphrase">
                  <Input
                    className="col"
                    placeholder="Passphrase"
                    name="passphrase"
                    onChange={e => this.update('passphrase', e.target.value)}
                  />
                </Label>

                <Button
                  className="mr-3 mb-3 p-2"
                  onClick={() => this.createAccount()}
                >
                  Create
                </Button>
                <Link dummy={true} onClick={() => this.toggle('createAccountView')}>
                  Cancel
                </Link>
                <span className="flex-grow-1" />
              </BoxGrid>
            }
          </BoxGrid>
          <div className="p-2">
            <List
              text="Accounts Overview"
              headers={WALLET_INFO_ACCOUNTS_LIST_HEADERS}
              data={accountOverviewList}
            />
          </div>
          <div className="p-2">
            <List type="transaction" data={txhistory} text="Recent Tx List" />
          </div>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default connect(
  walletInfo.mapStateToProps,
  walletInfo.mapDispatchToProps
)(withRouter(WalletInfo));
