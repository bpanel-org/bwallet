import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Text, Header, Button, Dropdown, Modal } from '@bpanel/bpanel-ui';
import { BoxGrid, Label, List, CreateAccount } from '../components';
import { WALLET_INFO_PENDING_MULTISIG_LIST_HEADERS } from '../constants/bwallet';
import { walletInfo } from '../mappings';

class WalletInfo extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      createAccountView: false,
      proposalFetch: false,
      accountId: '',
      passphrase: '',
      showModal: false,
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
    if (selectedWallet !== wallet) {
      // fetch detailed proposal information and reset
      // the send/receive tab index to 0
      selectWallet(wallet, type, { proposals: true, resetSendTab: true });
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
      selectAccount: PropTypes.func,
      selectedAccount: PropTypes.string,
      txhistory: PropTypes.array,
      selectedAccountInfo: PropTypes.object,
      theme: PropTypes.object,
      selectedAccountBalance: PropTypes.string,
      getMultisigProposals: PropTypes.func,
      selectProposal: PropTypes.func,
      tableProposals: PropTypes.array,
      selectTab: PropTypes.func,
      broadcastTransaction: PropTypes.func,
      getxpubCreateWatchOnly: PropTypes.func,
      createAccount: PropTypes.func,
      walletType: PropTypes.string,
      isWatchOnly: PropTypes.bool,
      selectedWalletTransactionCount: PropTypes.number,
      selectedWalletBalance: PropTypes.string,
      selectedAccountxpub: PropTypes.string,
      selectedAccountTransactionCount: PropTypes.number,
      selectedAccountUTXOCount: PropTypes.number,
      selectedAccountAvgUTXOSize: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      accounts: [],
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

  broadcast(proposalId) {
    const { broadcastTransaction, selectedWallet } = this.props;
    // broadcast raw tx
    broadcastTransaction({
      walletId: selectedWallet,
      fetchProposal: true, // fetch proposal tx from backend to submit
      propsalId: proposalId,
    });
  }

  selectAccount(accountId) {
    const { selectedWallet, selectAccount } = this.props;

    // third argument is a bool to fetch history of account
    selectAccount(selectedWallet, accountId, true);
  }

  selectWallet() {
    const { match } = this.props;
    const { params } = match;
    const { wallet } = params;

    // navigate to multisig complete page
    this.navigate(`/bwallet/send-receive/${wallet}`);
  }

  navigate(path) {
    const { history } = this.props;
    history.push(path);
    history.goForward();
  }

  selectProposal(proposalId) {
    const { selectProposal, selectedWallet, selectTab } = this.props;
    selectProposal(selectedWallet, proposalId);

    // select tab
    // this is fragile to changes
    selectTab('sendReceive', 2);
    this.navigate(`/bwallet/send-receive/${selectedWallet}`);
  }

  renderPendingList() {
    const { tableProposals } = this.props;
    // decorate Select property on each proposal
    // so that it shows up in the table
    const data = tableProposals.map(d => {
      // render broadcast button if the proposal is complete
      if (d.Complete)
        d.Select = (
          <Button onClick={() => this.broadcast(d.Name)}>Broadcast</Button>
        );
      else
        d.Select = (
          <Button onClick={() => this.selectProposal(d.Name)}>Select</Button>
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
      txhistory,
      selectedAccountBalance,
      selectedAccountTransactionCount,
      selectedAccountUTXOCount,
      selectedAccountAvgUTXOSize,
      selectedAccountxpub = '',
      selectedWalletBalance,
      selectedWalletTransactionCount,
      theme,
      match: {
        params: { type },
      },
      getxpubCreateWatchOnly,
      createAccount,
      walletType,
      isWatchOnly,
    } = this.props;

    // destructure match.params.type to
    // conditionally render the pending
    // multisig transactions if it is a
    // multisig view

    const { showModal } = this.state;

    // TODO: less hacky styles
    return (
      <div>
        {/* create account modal */}
        <Modal
          show={showModal}
          styles={{
            dialog: {
              width: '50%',
              minWidth: '450px',
              padding: '1rem',
              borderRadius: '0px',
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              maxWidth: '100%',
              maxHeight: '100%',
              overflow: 'auto',
            },
            content: {
              backgroundColor: theme.themeVariables.themeColors.lowlight1,
            },
          }}
          header="New Account"
          closeModal={() => this.toggle('showModal')}
        >
          <CreateAccount
            selectedWallet={selectedWallet}
            getxpubCreateWatchOnly={getxpubCreateWatchOnly}
            createAccount={createAccount}
            walletType={walletType}
            isWatchOnly={isWatchOnly}
          />
        </Modal>
        <BoxGrid colcount={1}>
          <BoxGrid colClass="d-flex align-items-start" colcount={1}>
            <Header type="h2">{selectedWallet}</Header>
            <BoxGrid rowClass="pr-4" colcount={1}>
              <Label text="Balance">
                <Text type="p">{selectedWalletBalance}</Text>
              </Label>
              <Label text="Accounts">
                <Text>{accounts.length}</Text>
              </Label>
              <Label text="Transactions">
                <Text>{selectedWalletTransactionCount}</Text>
              </Label>
              {/* don't show button for multisig wallets */}
              {walletType !== 'multisig' && (
                <Button onClick={() => this.toggle('showModal')}>
                  Create Account
                </Button>
              )}
            </BoxGrid>
          </BoxGrid>

          <Header
            style={{ borderBottom: theme.themeVariables.border2 }}
            type="h4"
          >
            Account Info
          </Header>
          <div className="d-inline-flex align-items-start row flex-grow p-2">
            <div className="col" style={{ width: '24rem' }}>
              <Label text="Accounts">
                <Dropdown
                  options={accounts}
                  onChange={({ value }) => this.selectAccount(value)}
                  placeholder={'Select Account'}
                  value={selectedAccount}
                  className="col"
                />
              </Label>
            </div>
            <div className="col" style={{ margin: 'auto' }}>
              <Button
                className="mr-3 mb-3 p-2"
                onClick={() => this.selectWallet()}
              >
                Send/Receive
              </Button>
            </div>
          </div>

          <BoxGrid colcount={4}>
            <div className="">
              <Text type="p">Balance: {selectedAccountBalance}</Text>
              <Text type="p">
                Transaction Count: {selectedAccountTransactionCount}
              </Text>
              <Text type="p">UTXO Count: {selectedAccountUTXOCount}</Text>
            </div>
            <div>
              <Text type="p">
                Average UTXO Size: {selectedAccountAvgUTXOSize}
              </Text>
              <Text type="p">
                Account Extended Public Key:{' '}
                <Text type="condensed">{selectedAccountxpub}</Text>
              </Text>
            </div>
            <div />
            <div />
          </BoxGrid>

          <BoxGrid colcount={1}>
            {type === 'multisig' && this.renderPendingList()}
            <div className="p-2">
              <List type="transaction" data={txhistory} text="Recent Tx List" />
            </div>
          </BoxGrid>
        </BoxGrid>
      </div>
    );
  }
}

export default connect(
  walletInfo.mapStateToProps,
  walletInfo.mapDispatchToProps
)(withRouter(WalletInfo));
