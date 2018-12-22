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
              Don&#39;t trust, verify.
            </Header>
          </div>
        </BoxGrid>
        <BoxGrid rowClass="text-center" colcount={2}>
          <div>
            <Header type="h3">Features:</Header>
            <ul
              style={{
                fontSize: '1.1rem',
                textAlign: 'left',
              }}
            >
              <li>View balances</li>
              <li>Send and receive transactions</li>
              <li>Create wallets and accounts</li>
              <li>Participate in multiparty transactions</li>
              <li>Integrate hardware security</li>
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
              <li>Air-gapped solutions for extra security</li>
            </ul>
          </div>
          <div>
            <Header type="h3">Sovereignty and Security.</Header>
            <Text type="p">
              bPanel and bWallet are designed to bring convinience and flexibility
              to decentralized networks, making it easy to access the full range
              of seurity and privacy tools that blockchains offer.
            </Text>
            <Text type="p">
              Make sure that you are on the proper url - {uri}
            </Text>
            <Text type="p"
              style={{ 
                fontStyle: 'italic',
                fontSize: '0.8rem'
              }}
            >
              bWallet is open source.
              Please report bugs or contribute on{' '}
              <Link to="https://github.com/bpanel-org/bpanel" style={{fontSize: '0.8rem' }}>
                Github
              </Link>!<br />
              Copyright (c) 2018, The bcoin Devs (https://github.com/bcoin-org)<br />
              Copyright (c) 2018, The bPanel Devs (https://github.com/bpanel-org)
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
