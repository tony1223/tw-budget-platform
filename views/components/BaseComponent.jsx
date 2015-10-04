
import React from "react";


export default class BaseComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.state || {};
  }

  isClient(){
    return global.window != null;
  }

  setStateWithLoading(state,delay){
    if(delay == null){
      delay = 0;
    }
    this.setState({_waiting:true},()=>{
      setTimeout(()=>{
        state._waiting = false;
        this.setState(state);
      },delay);
    });
  }

  setUrl(url,title){
    history.pushState({}, title , url);
  }

  bindKeyEnter(handler,args){
    var that = this;
    var args = [];
    for(var i = 1 ; i < arguments.length;++i){
      args.push(arguments[i]);
    }
    return (function(e){
      if(e.keyCode == 13){
        handler.apply(that,args);
        return false;
      }
    });
  }

}

