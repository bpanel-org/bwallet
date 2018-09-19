import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Header, TabMenu } from '@bpanel/bpanel-ui';
import { NewWallet, NewMultisigWallet, ImportWallet } from '../Components';

import { createNew } from '../mappings';

class CreateNew extends PureComponent {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      createWallet: PropTypes.func,
    };
  }

  static get defaultProps() {
    return {};
  }

  render() {
    const { createWallet } = this.props;
    const tabs = [
      { header: 'New Wallet', body: <NewWallet createWallet={createWallet} /> },
      { header: 'Import Wallet', body: <ImportWallet /> },
      {
        header: 'NewMultisigWallet',
        body: <NewMultisigWallet createWallet={createWallet} />,
      },
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
