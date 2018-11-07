import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header, Text, Button } from '@bpanel/bpanel-ui';
import { connect } from 'react-redux';
import { BoxGrid } from '../components';

import { multisigFollowUp } from '../mappings';

// TODO: break into own file
class SecretItem extends PureComponent {
  static get propTypes() {
    return {
      label: PropTypes.string,
      secret: PropTypes.string,
    };
  }

  render() {
    const { label, secret } = this.props;
    return (
      <BoxGrid colcount={1}>
        <Text>{label}</Text>
        <Text>{secret}</Text>
      </BoxGrid>
    );
  }
}

class MultisigFollowUp extends PureComponent {
  // render after ms wallet join and ms wallet create
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      joinKey: PropTypes.string,
      token: PropTypes.string,
      id: PropTypes.string,
      history: PropTypes.object,
    };
  }

  static get defaultProps() {
    return {};
  }

  // depends on react router
  complete() {
    const { history } = this.props;
    history.replace('/bwallet');
  }

  render() {
    const { joinKey, token, id } = this.props;

    return (
      <BoxGrid>
        <Header type="h2">Multi Party Wallet</Header>
        <Text>
          Your wallet {id} will be initialized after all participants have
          joined
        </Text>
        {joinKey && <SecretItem label={'Join Key'} secret={joinKey} />}
        {token && <SecretItem label={'Cosigner Token'} secret={token} />}
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
