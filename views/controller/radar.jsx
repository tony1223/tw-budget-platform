
import React from "react";
import unitconverter from "./../helpers/unitconverter.jsx";
// import rd3 from 'react-d3';

import D3Radar from './../components/d3Radar.jsx';

import Util from '../helpers/util';

import BaseComponent from './../components/BaseComponent.jsx';
export default class Bubble extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {data:[[
  {
    className: 'argentina',
    axes: [
      {axis: "strength", value: 10},
      {axis: "intelligence", value: 7},
      {axis: "charisma", value: 10},  
      {axis: "dexterity", value: 13},  
      {axis: "luck", value: 9}
    ]
  }
          ]]};

    setInterval(()=>{
      this.setState({
        data:[[
          {
            className: 'argentina',
            axes: [
              {axis: "strength", value: Math.random()*15},
              {axis: "intelligence", value: 7},
              {axis: "charisma", value: 10},  
              {axis: "dexterity", value:  Math.random()*15},  
              {axis: "luck", value: 9}
            ]
          }
        ]]
      })
    },2000);
  }
  

  componentDidMount() {
    
  }

  componentDidUpdate() {
    
  }


  componentWillUnmount() {
  }


  render(){
    //D3Radar

    return (
      <div className='row'>
        <D3Radar ref="d3" width="300" height="300" data={this.state.data} />
      </div>
    );
  }
}


if(global.window != null){
  React.render(React.createElement(Bubble,window.react_data), document.getElementById("react-root"));
}

