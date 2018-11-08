import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header, Text, Button } from '@bpanel/bpanel-ui';
import { connect } from 'react-redux';
import { BoxGrid, Label } from '../components';

import { multisigFollowUp } from '../mappings';

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
    history.replace('/bwallet');
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
