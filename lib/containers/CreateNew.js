import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  NewWallet,
  NewMultisigWallet,
  ImportWallet,
  PreselectOptions,
  WatchOnly,
} from '../Components';

import { createNew } from '../mappings';

class CreateNew extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      keyManagement: null,
      walletType: null,
      walletOpt: null,
    };
  }

  static get propTypes() {
    return {
      createWallet: PropTypes.func,
    };
  }

  static get defaultProps() {
    return {};
  }

  select(key, value) {
    this.setState({ [key]: value });
  }

  render() {
    const { createWallet } = this.props;
    const { keyManagement, walletType, walletOpt } = this.state;

    let render;

    /*
     * calculate what to render to attempt to make easy to read
     * the definitions for these values are found in PreselectOptions
     */
    const renderNewWallet =
      walletType === 'personal' &&
      keyManagement === 'node' &&
      walletOpt === 'standard';

    const renderHardwareImport =
      walletType === 'personal' && keyManagement === 'hardware';

    const renderWatchOnly =
      walletType === 'personal' &&
      keyManagement === 'node' &&
      walletOpt === 'watch-only';

    if (renderNewWallet) render = <NewWallet createWallet={createWallet} />;
    else if (renderHardwareImport)
      render = <ImportWallet createWallet={createWallet} />;
    else if (renderWatchOnly)
      render = <WatchOnly createWallet={createWallet} />;
    else if (walletType === 'multiparty')
      render = <NewMultisigWallet createWallet={createWallet} />;
    else render = null;

    return (
      <div>
        <PreselectOptions
          keyManagement={keyManagement}
          walletType={walletType}
          select={(...args) => this.select(...args)}
          walletOpt={walletOpt}
        >
          {render}
        </PreselectOptions>
      </div>
    );
  }
}

export default connect(
  createNew.mapStateToProps,
  createNew.mapDispatchToProps
)(CreateNew);
