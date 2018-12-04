import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  NewWallet,
  NewMultisigWallet,
  ImportWallet,
  WatchOnly,
  TreeView,
  SelectionView,
} from '../components';

import { createNew } from '../mappings';

/*
 * define the ux
 * the Nodes with SelectionView
 * are internal nodes and the nodes
 * with a different view are the leaves
 */
const root = new TreeView.Node(SelectionView, {
  breadcrumbLink: 'Wallet Ownership',
});
const personal = new TreeView.Node(SelectionView, {
  breadcrumbLink: 'Wallet Type',
  header: 'Personal Wallet',
  text: 'Personal Wallet',
  icon: 'fa-user',
});
const multiparty = new TreeView.Node(NewMultisigWallet, {
  breadcrumbLink: 'New Multiparty Wallet',
  header: 'Multiparty Wallet',
  text: 'Multiparty Wallet',
  icon: 'fa-users',
});

const importWallet = new TreeView.Node(ImportWallet, {
  breadcrumbLink: 'Import Hardware Wallet',
  header: 'Hardware',
  text: 'A hardware device will manage your keys',
  icon: 'fa-server',
});
const watchOnly = new TreeView.Node(WatchOnly, {
  breadcrumbLink: 'Create Watch Only',
  header: 'Watch Only',
  text: 'You cannot spend from this wallet',
  icon: 'fa-eye',
});
const standard = new TreeView.Node(NewWallet, {
  breadcrumbLink: 'Create Standard Wallet',
  header: 'Standard Wallet',
  text: 'A standard wallet for sending and receiving',
  icon: 'fa-plus',
});

/*
 * UX
 *
 * personal:
 *   standard, watch only, hardware
 * multiparty:
 *   standard
 *   TODO: add initialize once bledger supports it
 *
 * each node has a view and children
 * the view gets rendered and the children
 * are passed as children to the view
 */
root.addChild(personal);
root.addChild(multiparty);
personal.addChild(standard);
personal.addChild(watchOnly);
personal.addChild(importWallet);

class CreateNew extends PureComponent {
  static get propTypes() {
    return {
      createWallet: PropTypes.func,
      getxpubCreateWatchOnly: PropTypes.func,
      wallets: PropTypes.array,
      chain: PropTypes.string,
      network: PropTypes.string,
      getxpubCreateMultisigWallet: PropTypes.func,
      services: PropTypes.object,
    };
  }

  render() {
    const { services } = this.props;
    if (!services.multisig) multiparty.addProps({ disabled: true });
    else multiparty.addProps({ disabled: false });

    return <TreeView root={root} {...this.props} />;
  }
}

export default connect(
  createNew.mapStateToProps,
  createNew.mapDispatchToProps
)(CreateNew);
