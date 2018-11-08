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
      id: PropTypes.string,
      history: PropTypes.object, // react-router history
    };
  }

  static get defaultProps() {
    return {
      joinKey: null,
      token: null,
    };
  }

  // depends on react router
  complete() {
    const { history } = this.props;
    // dispatch action to clean the state here
    // this doesn't seem to work?
    history.replace(BASE_PATH);
  }

  // TODO: styles
  render() {
    const { joinKey, token, id } = this.props;

    return (
      <BoxGrid
        rowClass="text-center"
        colClass="flex-column justify-content-center m-auto"
        colcount={1}
      >
        <Header type="h2">Multi Party Wallet</Header>
        <Text>
          Your wallet {id} will be initialized after all participants have
          joined
        </Text>
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
