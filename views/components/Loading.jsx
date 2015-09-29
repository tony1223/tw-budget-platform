
import React from "react";
import cx from 'classnames';


//License:MIT
//reference : http://tobiasahlin.com/spinkit/

export default class Loading extends React.Component {

  constructor(props) {
    super(props);
  }

  render(){
    //TODO: fail back browsers
    //only hide when set it to false
    return (<div style={{display:this.props.show === false ? "none":""}} className="sk-circle">
      <div className="sk-circle1 sk-child"></div>
      <div className="sk-circle2 sk-child"></div>
      <div className="sk-circle3 sk-child"></div>
      <div className="sk-circle4 sk-child"></div>
      <div className="sk-circle5 sk-child"></div>
      <div className="sk-circle6 sk-child"></div>
      <div className="sk-circle7 sk-child"></div>
      <div className="sk-circle8 sk-child"></div>
      <div className="sk-circle9 sk-child"></div>
      <div className="sk-circle10 sk-child"></div>
      <div className="sk-circle11 sk-child"></div>
      <div className="sk-circle12 sk-child"></div>
    </div>);
  }
}

