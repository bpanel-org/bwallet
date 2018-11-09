import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header, Text, Button } from '@bpanel/bpanel-ui';
import { connect } from 'react-redux';
import { BoxGrid, Label } from '../components';

import { BASE_PATH } from '../constants';
import { multisigFollowUp } from '../mappings';

/*
 * can use path params to determine which view to show
 * /bwallet/multisig/:walletId/:action
 *
 * where action is new or join
 *
 * new multisig wallet, show join key and token
 * joined multisig wallet, show token
 */

class MultisigFollowUp extends PureComponent {
  static get propTypes() {
    return {
      joinKey: PropTypes.string,
      token: PropTypes.string,
      walletId: PropTypes.string,
      cosignerId: PropTypes.string,
      path: PropTypes.string,
      m: PropTypes.number,
      n: PropTypes.number,
      initialized: PropTypes.bool,
      cosigners: PropTypes.array,
      history: PropTypes.object, // react-router history
    };
  }

  static get defaultProps() {
    return {
      joinKey: null,
      token: null,
      cosigners: [],
    };
  }

  headerCopy() {
    const { action, walletId, m, n, cosigners } = this.props;
    // action can be join or new

    if (action === 'join') {
      // wallet can be initialized or not initialized
      if (initialized)
        return `Wallet ${walletId} initialized`;
      return `Wallet ${walletId} has ${cosigners.length}, needs ${n} total`;
    }

    if (action === 'new')
      return `Your wallet ${walletId} will be initialized after all participants have joined`;
  }

  componentWillUnmount() {
    const { setTemporarySecrets, walletId } = this.props;
    // clear the temporary secrets
    setTemporarySecrets(walletId, { type: 'clear' });
  }

  // depends on react router
  complete() {
    const { history } = this.props;
    history.replace(`/${BASE_PATH}`);
  }

  // TODO: styles and copy
  render() {
    const { joinKey, token, walletId, cosignerId, initialized } = this.props;

    return (
      <BoxGrid
        rowClass="text-center"
        colClass="flex-column justify-content-center m-auto"
        colcount={1}
      >
        <Header type="h2">Multi Party Wallet</Header>
        <Text>
          {this.headerCopy()}
        </Text>
        {cosignerId && (
          <Label text="Cosigner ID">
            <Text>{cosignerId}</Text>
          </Label>
        )}
        {joinKey && (
          <Label text="Join Key">
            <Text>{joinKey}</Text>
          </Label>
        )}
        {token && (
          <Label text="Cosigner Token">
            <Text>{token}</Text>
          </Label>
        )}
        <Text>Are you sure you wrote info down?</Text>
        <Button onClick={() => this.complete()}>Yes</Button>
      </BoxGrid>
    );
  }
}

export default connect(
  multisigFollowUp.mapStateToProps,
  multisigFollowUp.mapDispatchToProps
)(MultisigFollowUp);
