
export const metadata = {
  name: 'wallet',
  author: 'bcoin team',
  description: '',
  version: require('../package.json').version
};

/* END EXPORTS */


// a decorator for the Panel container component in our app
// here we're extending the Panel's children by adding
// our plugin's component (`MyComponent` below)
// You'll want to make sure to import an actual component
// This is what you need if you're making a new view/route
export const decoratePanel = (Panel, { React, PropTypes }) => {
  return class extends React.Component {
    static displayName() {
      return metadata.name;
    }

    render() {
      const { customChildren = [] } = this.props;
      // const routeData = {
      //   name: metadata.name,
      //   Component: MyComponent
      // };
      return (
        <Panel
          {...this.props}
          customChildren={customChildren}
          // customChildren={customChildren.concat(routeData)}
        />
      );
    }
  };
};
// If you're adding a whole new view/Panel
// you'll want this to get props from the state, through
// Panel and to your specific route

// mapComponentDispatch will use react-redux's connect to
// retrieve props from the state, but we need a way
// for the Panel Container to pass it down to the plugin's Route view
// props getters like this are used in the app to pass new props
// added by plugins down to children components (such as your plugin)
// The Route props getter is special since different routes will want diff props
// so we pass the getter as the value of an object prop, w/ the key
// corresponding to the route that needs the props
export const getRouteProps = {
  [metadata.name]: (parentProps, props) =>
    Object.assign(props, {
      // myProp: parentProps.myProp,
    })
};

// This connects your plugin's component to the state's dispatcher
// Make sure to pass in an actual action to the dispatcher
export const mapComponentDispatch = {
  // Panel: (dispatch, map) =>
  //   Object.assign(map, {
  //     actionCreator: () => dispatch(actionCreator())
  //   })
};


// Tells the decorator what our plugin needs from the state
// This is available for container components that use an
// extended version of react-redux's connect to connect
// a container to the state and retrieve props
// make sure to replace the corresponding state mapping
// (e.g. `state.chain.height`) and prop names
export const mapComponentState = {
  // Panel: (state, map) =>
  //   Object.assign(map, {
  //     localProp: state.childState.stateProp,
  //   })
};

// decorator for the node reducer
// this will extend the current node reducer
// make sure to replace out the constants
// and prop names with your actual targets
// NOTE: state uses `seamless-immutable` to ensure immutability
// See their API Docs for more details (e.g. `set`)
// https://www.npmjs.com/package/seamless-immutable
export const reduceNode = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    // case 'ACTION_CONSTANT': {
    //   return state.set('testProp', payload);
    //   break;
    // }

    default:
      return state;
  }
};

// decorator for the chain reducer
// this will extend the current chain reducer
// make sure to replace out the constants
// and prop names with your actual targets
// NOTE: state uses `seamless-immutable` to ensure immutability
// See their API Docs for more details (e.g. `set`)
// https://www.npmjs.com/package/seamless-immutable
export const reduceChain = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    // case 'ACTION_CONSTANT': {
    //   return state.set('testProp', payload);
    //   break;
    // }

    default:
      return state;
  }
};

