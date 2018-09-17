import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Header, TabMenu } from '@bpanel/bpanel-ui';
import { NewWallet, NewMultisigWallet, ImportWallet } from '../Components';

import { createNew } from '../mappings'

class CreateNew extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const tabs = [
      { header: 'New Wallet', body: <NewWallet /> },
      { header: 'Import Wallet', body: <ImportWallet /> },
      { header: 'NewMultisigWallet', body: <NewMultisigWallet /> },
    ];
    return (
      <div>
        <Header type="h2">Create New</Header>
        <TabMenu tabs={tabs} />
      </div>
    );
  }
}


export default connect(
  createNew.mapStateToProps,
  createNew.mapDispatchToProps
)(CreateNew);
