import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Header, TabMenu } from '@bpanel/bpanel-ui';
import { NewWallet, NewMultisigWallet, ImportWallet } from '../Components';

class CreateNew extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const tabs = [
      { header: 'New Wallet', body: (<NewWallet />) },
      { header: 'Import Wallet', body: (<ImportWallet />) },
      { header: 'NewMultisigWallet', body: (<NewMultisigWallet />) },
    ];
    return (
      <div>
        <Header type="h2">Create New</Header>
        <TabMenu tabs={tabs}/>
      </div>
    );
  }
}

const mapStateToProps = (state, otherProps) => {
  return { ...otherProps };
};

const mapDispatchToProps = dispatch => {
  return {
    undefined: async () => dispatch(),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateNew);

