/*
 * bwallet entrypoint
 *
 */

import { MainContainer } from './containers';

import {
  reduceNode,
  reduceChain,
  reduceWallets,
  reduceInterface,
  bwallet,
} from './reducers';

import {
  PLUGIN_NAMESPACE,
  REDUCE_NODE_NAMESPACE,
  REDUCE_CHAIN_NAMESPACE,
  REDUCE_WALLETS_NAMESPACE,
  REDUCE_INTERFACE_NAMESPACE,
} from './constants';

export const pluginReducers = {
  //[PLUGIN_NAMESPACE]: bwallet,
  [REDUCE_INTERFACE_NAMESPACE]: reduceInterface,
  [REDUCE_NODE_NAMESPACE]: reduceNode,
  [REDUCE_CHAIN_NAMESPACE]: reduceChain,
  [REDUCE_WALLETS_NAMESPACE]: reduceWallets,
};

export const metadata = {
  name: 'bwallet',
  author: 'bcoin team',
  description: 'bitcoin wallet management tool',
  pathName: 'bwallet',
  displayName: 'bWallet',
  sidebar: true,
  icon: 'money',
  version: require('../package.json').version,
};

export const decoratePanel = (Panel, { React, PropTypes }) => {
  return class extends React.Component {
    static displayName() {
      return metadata.name;
    }

    static get propTypes() {
      return {
        customChildren: PropTypes.array,
      };
    }

    render() {
      const { customChildren = [] } = this.props;
      const pluginData = {
        metadata,
        Component: MainContainer,
      };

      return (
        <Panel
          {...this.props}
          customChildren={customChildren.concat(pluginData)}
        />
      );
    }
  };
};
