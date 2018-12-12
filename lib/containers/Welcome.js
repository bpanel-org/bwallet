import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Header, Text, Link } from '@bpanel/bpanel-ui';
import { BoxGrid } from '../components';
import PropTypes from 'prop-types';

import { welcome } from '../mappings';

class Welcome extends PureComponent {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      uri: PropTypes.string,
    };
  }

  // TODO: localization, import this copy from a json file
  render() {
    const { uri } = this.props;
    return (
      <React.Fragment>
        <BoxGrid
          rowClass="text-center mb-3"
          colClass="align-self-center"
          colcount={1}
        >
          <div>
            <Header type="h1">bWallet</Header>
            <Header type="h3" style={{ fontStyle: 'italic' }}>
              Don&#39;t Trust, Verify
            </Header>
            <Text className="text-left" type="p">
              bwallet allows you to manage, use and build on top of you&#39;re
              own node. Blockchain was founded on the idea of giving people more
              control, but it turns out that control comes with a lot of
              responsibility.
            </Text>
          </div>
        </BoxGrid>
        <BoxGrid rowClass="text-center" colcount={2}>
          <div>
            <Header type="h3">Features</Header>
            <Header type="h6">What can you do with bWallet?</Header>
            <ul
              style={{
                textTransform: 'capitalize',
                fontSize: '1.1rem',
                textAlign: 'left',
              }}
            >
              <li>View balances</li>
              <li>send/receive transactions</li>
              <li>create multisig wallets</li>
              <li>use hardware devices</li>
              <li>fork or submit new features</li>
            </ul>

            <Header type="h6">Coming soon:</Header>
            <ul
              style={{
                fontSize: '1.1rem',
                textAlign: 'left',
              }}
            >
              <li>Customizations with widgets</li>
              <li>Advanced mode for power users</li>
              <li>Air gapped solutions for extra security</li>
            </ul>
          </div>
          <div>
            <Header type="h3">bPanel + bWallet = </Header>
            <Header type="h6">Personal Sovereignty</Header>
            <Text className="text-left" type="p">
              You are responsible for your funds. There is no way to call
              customer support to get them back. Understanding how to keep
              yourself safe in this new internet is very important.
            </Text>
            <Header type="h5">This is not a bank</Header>
            <Text type="p">
              This is a tool to help you be in charge of your own node, and your
              own funds. With great power comes great responsibility.
            </Text>
            <Text type="p">
              Make sure that you are on the proper url - {uri}
            </Text>
            <Text type="p">bwallet is open source</Text>
            <Text type="p">
              Please report bugs or contribute at{' '}
              <Link to="https://github.com/bpanel-org/bpanel">Github</Link>!
            </Text>
            <Text type="p">
              Copyright (c) 2018, The bcoin Devs (https://github.com/bcoin-org)
            </Text>
            <Text type="p">
              Copyright (c) 2018, The bPanel Devs
              (https://github.com/bpanel-org)
            </Text>
          </div>
        </BoxGrid>
      </React.Fragment>
    );
  }
}

export default connect(
  welcome.mapStateToProps,
  welcome.mapDispatchToProps
)(Welcome);
