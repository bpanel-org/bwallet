import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header, Text, Input, Button } from '@bpanel/bpanel-ui';
import { connect } from 'react-redux';

import TerminalView from '../components/TerminalView';
import { multisigFollowUp } from '../mappings'

import { multisigFollowUp as style } from '../style';

class SecretItem extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { label, secret } = this.props;

    return (
      <div style={style.secretItem} className="row">
        <div className="row">
          <div style={style.secretLabel}>{label}</div>
        </div>
        <div className="row">
          <div style={style.secretValue}>{secret}</div>
        </div>
      </div>
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
    return {}
  }

  // depends on react router
  complete() {
    const { history } = this.props;
    history.replace('/bwallet');
  }

  render() {
    const { joinKey, token, id } = this.props;

    return (
      <div className="container">
        <div style={style.rowItem} className="row">
          <Header type="h2">Multi Party Wallet</Header>
        </div>
        <div style={style.rowItem} className="row">
          <Text>Your wallet {id} will be initialized after all participants have joined</Text>
        </div>
        {joinKey && <SecretItem label={'Join Key'} secret={joinKey} />}
        {token && <SecretItem label={'Cosigner Token'} secret={token} />}
        <div style={style.rowItem} className="row">
          <Text style={style.rightPad}>Are you sure you wrote info down?</Text>
          <Button onClick={() => this.complete()}>
            Yes
          </Button>
        </div>
      </div>
    );
  }
}

export default connect(
  multisigFollowUp.mapStateToProps,
  multisigFollowUp.mapDispatchToProps,
)(MultisigFollowUp);
