import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class TerminalView extends PureComponent {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
      ]).isRequired,
    };
  }

  render() {
    const { children } = this.props;

    /*
     * Making the assumption that the terminal view
     * only has 2 children
     */

    return (
      <div className="container">
        <div className="row">
          {React.Children.map(children, child => {
            return <div className="col-md-6">{child}</div>;
          })}
        </div>
      </div>
    );
  }
}

export default TerminalView;
