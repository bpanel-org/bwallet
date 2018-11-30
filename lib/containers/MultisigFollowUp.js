import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header, Text, Button } from '@bpanel/bpanel-ui';
import { connect } from 'react-redux';
import { BoxGrid, Label } from '../components';

import { BASE_PATH } from '../constants';
import { multisigFollowUp } from '../mappings';

import { multisigComplete as style } from '../style';

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
      action: PropTypes.string,
      setTemporarySecrets: PropTypes.func,
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
    const { action, walletId, m, n, cosigners, initialized } = this.props;
    // action can be join or new

    if (action === 'join') {
      // wallet can be initialized or not initialized
      if (initialized) return `Wallet ${walletId} initialized`;
      return `Wallet ${walletId} has ${cosigners.length}, needs ${n} total`;
    }

    if (action === 'new')
      return `Your wallet ${m} of ${n} ${walletId} will be initialized after all participants have joined`;
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

  render() {
    const { joinKey, token, cosignerId } = this.props;

    return (
      <BoxGrid
        rowClass="text-center"
        colClass="flex-column justify-content-center m-auto"
        colcount={2}
      >
        <div>
          <Header type="h2">Multi Party Wallet</Header>
          {cosignerId && (
            <Label className="d-flex align-items-start" text="Cosigner ID">
              <Text style={style.secretText} type="p">
                {cosignerId}
              </Text>
            </Label>
          )}
          {joinKey && (
            <Label className="d-flex align-items-start" text="Join Key">
              <Text style={style.secretText} type="p">
                {joinKey}
              </Text>
            </Label>
          )}
          {token && (
            <Label className="d-flex align-items-start" text="Cosigner Token">
              <Text style={style.secretText} type="p">
                {token}
              </Text>
            </Label>
          )}
        </div>
        <BoxGrid colcount={1} rowClass="d-inline">
          <br />
          <br /> {/* pad the top a bit */}
          <Text type="p">{this.headerCopy()}</Text>
          {/* only render relevent copy */}
          {joinKey && (
            <Text type="p">
              Privately share your Join Key with participants.
            </Text>
          )}
          {token && (
            <Text type="p">
              Your cosigner token will be used to approve multi party proposals.
              Please be sure to record this information.
            </Text>
          )}
          <Text type="p">Are you sure you recorded this information?</Text>
          <Button onClick={() => this.complete()}>Complete</Button>
        </BoxGrid>
      </BoxGrid>
    );
  }
}

export default connect(
  multisigFollowUp.mapStateToProps,
  multisigFollowUp.mapDispatchToProps
)(MultisigFollowUp);
