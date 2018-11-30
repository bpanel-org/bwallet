import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Text, Header, Button, Dropdown, Link, Input } from '@bpanel/bpanel-ui';
import { BoxGrid, Label, List } from '../components';
import { WALLET_INFO_ACCOUNTS_LIST_HEADERS, WALLET_INFO_PENDING_MULTISIG_LIST_HEADERS } from '../constants/bwallet';
import { walletInfo } from '../mappings';

class WalletInfo extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      createAccountView: false,
      proposalFetch: false,
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
      getMultisigProposals,
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
    if (selectedWallet !== wallet) {
      selectWallet(wallet, type, { proposals: true });
    }

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
      selectedAccountInfo: PropTypes.object,
      theme: PropTypes.object,
      selectedAccountBalance: PropTypes.string,
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
      },
      theme: {
        themeVariables: {
          themeColors: {},
        },
      },
      tableProposals: [],
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
    await createAccount(
      selectedWallet,
      accountId,
      {
        passphrase,
      },
      true
    );
  }

  selectAccount(accountId) {
    const { selectedWallet, selectAccount } = this.props;

    // third argument is a bool to fetch history of account
    selectAccount(selectedWallet, accountId, true);
  }

  selectWallet() {
    const { history, match } = this.props;
    const { params } = match;
    const { wallet } = params;

    // navigate to multisig complete page
    this.navigate(`/bwallet/send-receive/${wallet}`);
  }

  navigate(path) {
    const { history, match } = this.props;
    history.push(path);
    history.goForward();
  }

  selectProposal(proposalId) {
    const { selectProposal, selectedWallet } = this.props;
    selectProposal(selectedWallet, proposalId);
    this.navigate(`/bwallet/send-receive/${selectedWallet}`);
  }

  renderPendingList() {
    const { tableProposals, selectProposal } = this.props;
    // decorate Select property on each proposal
    // so that it shows up in the table
    const data = tableProposals.map(d => {
      d.Select = (
        <Button onClick={() => this.selectProposal(d.Name)}>
          Select
        </Button>
    );
      return d;
    });
    return (
      <div className="p-2">
        <List
          text="Pending Multiparty Transactions"
          headers={WALLET_INFO_PENDING_MULTISIG_LIST_HEADERS}
          data={data}
        />
      </div>
    );
  }

  render() {
    const {
      selectedWallet,
      selectedAccount,
      accounts,
      accountOverviewList,
      selectedWalletInfo,
      txhistory,
      selectedAccountBalance,
      theme,
      match: { params: { type } },
    } = this.props;

    // destructure match.params.type to
    // conditionally render the pending
    // multisig transactions if it is a
    // multisig view

    const { createAccountView } = this.state;

    // TODO: handle coin ticker
    return (
      <BoxGrid colcount={1}>
        <BoxGrid colClass="d-flex align-items-start" colcount={1}>
          <Header type="h2">{selectedWallet}</Header>
          <BoxGrid rowClass="pr-4" colcount={1}>
            <Label text="Balance">
              <Text type="p">{selectedAccountBalance}</Text>
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
          <BoxGrid colcount={2}>
            {/* conditional rendering based on showing create
                account view or regular view
            */}
            <div
              className="p-3"
              style={{ background: theme.themeVariables.themeColors.lightBg }}
            >
              {!createAccountView && (
                <div>
                  <BoxGrid colClass="m-auto" rowClass="pb-4" colcount={2}>
                    <Label text="Accounts">
                      <Dropdown
                        options={accounts}
                        onChange={({ value }) => this.selectAccount(value)}
                        placeholder={selectedAccount || 'Select Account'}
                      />
                    </Label>
                    <Text>Balance: {selectedAccountBalance}</Text>
                  </BoxGrid>
                  <div className="d-flex align-items-start">
                    <Button
                      className="mr-3 mb-3 p-2"
                      onClick={() => this.selectWallet()}
                    >
                      Send/Receive
                    </Button>
                    <span className="flex-grow-1" />
                    <Button
                      className="mr-3 mb-3 p-2"
                      onClick={() => this.toggle('createAccountView')}
                    >
                      Add Account
                    </Button>
                  </div>
                </div>
              )}
              {createAccountView && (
                <BoxGrid colClass="m-auto" rowClass="pb-4" colcount={2}>
                  <div>
                    <Label text="Account Name">
                      <Input
                        className="col"
                        placeholder="Account Name"
                        name="accountId"
                        onChange={e => this.update('accountId', e.target.value)}
                      />
                    </Label>
                    <Label text="Wallet Passphrase">
                      <Input
                        className="col"
                        placeholder="Passphrase"
                        name="passphrase"
                        onChange={e =>
                          this.update('passphrase', e.target.value)
                        }
                      />
                    </Label>
                  </div>

                  <div className="d-flex justify-content-around align-items-center">
                    <Button
                      className="mr-3 p-2"
                      onClick={() => this.createAccount()}
                    >
                      Create
                    </Button>
                    <Link
                      dummy={true}
                      onClick={() => this.toggle('createAccountView')}
                    >
                      Cancel
                    </Link>
                  </div>
                </BoxGrid>
              )}
            </div>
            <span className="flex-grow-1" />
          </BoxGrid>
          <div className="p-2">
            <List
              text="Accounts Overview"
              headers={WALLET_INFO_ACCOUNTS_LIST_HEADERS}
              data={accountOverviewList}
            />
          </div>
          {type === 'multisig' && this.renderPendingList()}
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
