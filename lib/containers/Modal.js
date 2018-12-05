import React, { PureComponent } from 'react';
import { Button, Header } from '@bpanel/bpanel-ui'
import { connect } from 'react-redux';
import { BoxGrid, TreeView, SelectionView } from '../components'
import { modal } from '../mappings';

/*
 * define the ux
 */
class NewAccount extends PureComponent {
  render() {
    return (
      <div>
        <h1>test</h1>
      </div>
    );
  }
}

const root = new TreeView.Node(SelectionView, {
  breadcrumbLink: 'Wallet Ownership',
});

// TODO: define ux based type of wallet
// multisig wallet has no create account
// watch only wallet gets xpub/hardware import watch only accounts
// standard wallet gets to create bcoin standard accounts
//
const xpub = new TreeView.Node(NewAccount, {
  breadcrumbLink: 'Import xpub',
  header: 'Import xpub',
  text: 'xpub string',
  icon: 'fa-plus',
});
const hardware = new TreeView.Node(NewAccount, {
  breadcrumbLink: 'New Hardware Account',
  header: 'Hardware Account',
  text: 'pull xpub from hardware device',
  icon: 'fa-plus',
});

root.addChild(xpub);
root.addChild(hardware);

class Modal extends React.PureComponent {
  render() {
    return (
      <BoxGrid>
        <Header type="h2">New Account</Header>
        <TreeView root={root} {...this.props} />
        <Button onClick={() => this.props.setModal()}>
          Close
        </Button>
      </BoxGrid>
    );
  }
}

export default connect(modal.mapStateToProps,modal.mapDispatchToProps)(Modal);
