import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header, Link, Text } from '@bpanel/bpanel-ui';

/*
 * Node is a tree node
 */
class Node {
  constructor(component, props = {}) {
    this.component = component;
    this.children = [];
    this.parent = null;
    this.props = props;
  }

  addChild(node) {
    node.parent = this;
    this.children.push(node);
  }

  clone() {
    const node = new this.constructor(this.component, this.props);
    node.parent = this.parent;
    for (const child of this.children)
      node.addChild(child.clone());
    return node;
  }
}

/*
 * BreadCrumbs renders the ux trail
 * by iteratively following the parents
 * of the tree
 */
class BreadCrumbs extends PureComponent {
  render() {
    const { onClick } = this.props;
    let { currentView } = this.props;

    let render = [];
    let i = 0;
    while (currentView) {
      const clone = currentView.clone();
      render.unshift(
        <Link dummy={true}
          key={i++}
          onClick={() => onClick(clone)}
        >
          {clone.props.breadcrumbLink}
        </Link>,
        <Text key={i++}>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</Text>
      );
      currentView = currentView.parent;
    }
    // remove extra text element
    render.pop();
    return (
      <div className="row p-3">
        {render}
      </div>
    );
  }
}

/*
 * TreeView manages the tree traversal
 * It is initialized with a tree root
 * and keeps track of the current node
 * in the tree that is being rendered
 */
class TreeView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentView: null,
    };
    this.selectNode = this.selectNode.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.currentView === null)
      return {
        currentView: props.root
      }
    return null;
  }

  static get propTypes() {
    return {
      root: PropTypes.object,
    }
  }

  static get defaultProps() {
    return {
      root: {},
    }
  }

  static get Node() {
    return Node;
  }

  selectNode(node) {
    this.setState({ currentView: node });
  }

  render() {
    const Component = this.state.currentView.component;
    const { children, props } = this.state.currentView;
    return (
      <div className="container">
        <BreadCrumbs currentView={this.state.currentView} onClick={this.selectNode} />
        <Component
          children={children}
          onClick={this.selectNode}
          {...this.props}
          {...props}
        />
      </div>
    );
  }
}

export default TreeView;
