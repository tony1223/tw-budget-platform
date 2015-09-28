
import React from "react";

export default class Error extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
 
  }

  render() {
    return <div>
      <h1>Sorry:{this.props.message}</h1>
      <h2>{this.props.error.status}</h2>
      /* <pre>{this.props.error.stack}</pre> */
    </div>;
  }
}
