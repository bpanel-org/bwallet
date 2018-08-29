/*
 * bwallet entrypoint
 *
 */

import MainContainer from './Containers';

export {
  mapComponentState,
  mapComponentDispatch,
  getRouteProps,
} from './mappings';
export { reduceNode, reduceChain } from './reducers';

export const metadata = {
  name: 'bwallet',
  author: 'bcoin team',
  description: '',
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
      const routeData = {
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
