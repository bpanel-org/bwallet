/*
 * bwallet entrypoint
 *
 */

import { MainContainer } from './Containers';

export { reduceNode, reduceChain, reduceWallet } from './reducers';

import { getWallets } from './actions/wallet';

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
