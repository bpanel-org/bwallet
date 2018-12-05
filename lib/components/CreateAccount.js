import React, { PureComponent } from 'react';
import ViewButton from './ViewButton';
import BoxGrid from './BoxGrid';
import { Link, Header, utils, Input, Text, Dropdown, Button } from '@bpanel/bpanel-ui';
const { connectTheme } = utils;
import Label from './Label';

const style = theme => ({
  topBarContainer: {
    border: theme.themeVariables.border1,
    backgroundColor: theme.themeVariables.themeColors.mediumBg,
  },
  mainContainer: {
    backgroundColor: theme.themeVariables.themeColors.darkBg,
    border: theme.themeVariables.border1,
    width: '100%',
  },
  viewContainer: {
    backgroundColor: theme.themeVariables.themeColors.darkBg,
    width: '100%',
  },
})

class CreateAccount extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      view: null,
      accountId: '',
      accountNumber: 0,
      selectedHardware: '',
      passphrase: '',
      xpub: '',
    }

    this.hardwareOptions = ['ledger'];
  }

  update(key, value) {
    this.setState({[key]: value});
  }

  renderTopBar() {
    const { theme } = this.props;
    return (
      <div style={style(theme).topBarContainer} className="row">
        <Label text="Select account type">
          <Header type="h2">Add Account</Header>
        </Label>
      </div>
    );
  }

  renderSelect() {
    const { theme } = this.props;
    return (
      <div style={style(theme).mainContainer} className="d-inline-flex">
        <ViewButton
          header={'xpub'}
          text={'Enter an xpub to import'}
          onClick={() => this.update('view', 'xpub')}
        />
        <ViewButton
          header={'Hardware'}
          text={'Import an account from hardware.'}
          onClick={() => this.update('view', 'hardware')}
        />
      </div>
    );
  }

  renderxpub() {
    const { theme } = this.props;
    const { passphrase, xpub, accountId } = this.state;
    return (
      <BoxGrid style={style(theme).viewContainer} childrenClass="p-2" rowClass="d-inline-flex">

        <Label className="d-flex align-items-start" text="Account Name">
          <Input
            name="accountName"
            className="col"
            placeholder="Account Name"
            onChange={e => this.update('accountId', e.target.value)}
            value={accountId}
          />
        </Label>

        <Label className="d-flex align-items-start" text="Wallet Passphrase">
          <Input
            name="passphrase"
            className="col"
            placeholder="Wallet Passphrase"
            onChange={e => this.input('passphrase', e.target.value)}
            value={passphrase}
          />
        </Label>
        <Label className="d-flex align-items-start" text="xpub">
          <Input
            name="xpub"
            className="col"
            placeholder="xpub"
            onChange={e => this.input('xpub', e.target.value)}
            value={xpub}
          />
        </Label>
      </BoxGrid>
    )
  }

  renderHardware() {
    const { theme } = this.props;
    const { accountId, passphrase, accountIndex, selectedHardware } = this.state;
    return (
      <BoxGrid style={style(theme).viewContainer} childrenClass="p-2" rowClass="d-inline-flex">

        <Label className="d-flex align-items-start" text="Account Name">
          <Input
            name="accountName"
            className="col"
            placeholder="Account Name"
            onChange={e => this.update('accountId', e.target.value)}
          />
        </Label>

        <Label className="d-flex align-items-start" text="Wallet Passphrase">
          <Input
            name="passphrase"
            className="col"
            placeholder="Wallet Passphrase"
            onChange={e => this.update('passphrase', e.target.value)}
            value={passphrase}
          />
        </Label>

        <Label className="d-flex align-items-start" text="Hardware Type">
          <Dropdown
            options={this.hardwareOptions}
            onChange={({ value }) => this.update('selectedHardware', value)}
            value={selectedHardware}
          />
        </Label>

        <Label className="d-flex align-items-start" text="Account Number">
          <Input
            type="number"
            name="accountNumber"
            className="col"
            placeholder="Account"
            onChange={e => this.update('accountIndex', e.target.value)}
          />
        </Label>
      </BoxGrid>
    );
  }

  renderFooter() {
    const { view } = this.state;
    const { theme } = this.props;
    if (view)
      return (
        <div style={style(theme).viewContainer} className="row d-inline-flex p-2">
          <Link className="p-2" dummy onClick={() => this.update('view', null)}>
            Back
          </Link>
          <Button className="p-2" onClick={() => this.create()}>
            Create
          </Button>
        </div>
      );
  }

  async create() {

    const { view, accountId, passphrase, accountIndex } = this.state;
    const { getxpubCreateWatchOnly, createAccount, selectedWallet } = this.props;

    if (view === 'xpub') {

      // create account
      await createAccount(selectedWallet, accountId, {
        passphrase,
      }, true);

    } else if (view === 'hardare') {

      // get xpub create account
      getxpubCreateWatchOnly(selectedWallet, accountId, {
        account: accountIndex,
        hardwareType: selectedHardware,
      });
    }
  }

  renderMain() {
    const { view } = this.state;
    if (!view)
      return this.renderSelect();

    if (view === 'xpub')
      return this.renderxpub();

    if (view === 'hardware')
      return this.renderHardware();
  }

  /*
   * watch only:
   *   selection screen - watch only, xpub
   * standard
   *   standard create screen
   */
  render() {
    return (
      <div>
        {this.renderTopBar()}
        {this.renderMain()}
        {this.renderFooter()}
      </div>
    );
  }
}

export default connectTheme(CreateAccount);
