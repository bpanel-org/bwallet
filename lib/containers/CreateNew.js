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
  breadcrumbLink: 'Key Management',
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
const nodeManaged = new TreeView.Node(SelectionView, {
  breadcrumbLink: 'Wallet Type',
  header: 'Node Managed',
  text: 'The connected node will manage your keys',
  icon: 'fa-desktop',
});
const importWallet = new TreeView.Node(ImportWallet, {
  breadcrumbLink: 'Import Wallet',
  header: 'Hardware',
  text: 'A hardware device will manage your keys',
  icon: 'fa-server',
});
const watchOnly = new TreeView.Node(WatchOnly, {
  breadcrumbLink: 'Watch Only',
  header: 'Watch Only',
  text: 'You cannot spend from this wallet',
  icon: 'fa-eye',
});
const newWallet = new TreeView.Node(NewWallet, {
  breadcrumbLink: 'New Wallet',
  header: 'New Wallet',
  text: 'A standard wallet for sending and receiving',
  icon: 'fa-plus',
});

/*
 * each node has a view and children
 * the view gets rendered and the children
 * are passed as children to the view
 */
root.addChild(personal);
root.addChild(multiparty);
personal.addChild(nodeManaged);
personal.addChild(importWallet);
nodeManaged.addChild(newWallet);
nodeManaged.addChild(watchOnly);

class CreateNew extends PureComponent {
  static get propTypes() {
    return {
      createWallet: PropTypes.func,
      getxpubCreateWatchOnly: PropTypes.func,
      wallets: PropTypes.array,
      chain: PropTypes.string,
      network: PropTypes.string,
      getxpubCreateMultisigWallet: PropTypes.func,
    };
  }

  static get defaultProps() {
    return {
      wallets: [],
    };
  }

  render() {
    return <TreeView root={root} {...this.props} />;
  }
}

export default connect(
  createNew.mapStateToProps,
  createNew.mapDispatchToProps
)(CreateNew);
