

import React from "react";
import cx from 'classnames';
import BaseComponent from '../BaseComponent.jsx';
import Loading from '../Loading.jsx';

import fbutil from '../../helpers/fb.jsx';


export default class FBComment extends BaseComponent {

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.initFBComment();
  }

  initFBComment(){
    fbutil.parse(React.findDOMNode(this)).then(()=>{
      this.setState({loaded:true});
    });
  }

  componentWillReceiveProps(nextProps){
    if(this.props.href != nextProps.href ){
      this.setState({loaded:false});
    }
  }

  componentDidUpdate(prevProps,prevState){
    if(this.props.href != prevProps.href ){
      this.initFBComment();
    }
  }

  render(){
    var b = this.props.item;
    return (
      <div style={{ background:"white"}}>
        <div data-width="100%" style={{display:this.state.loaded ? "" :"none"}} className="fb-comments" 
          data-href={this.props.href}
          data-numposts={this.props.numposts == null ? 5 : this.props.numposts}></div>
        <Loading show={!!!this.state.loaded} />
      </div>
    );
  }
}

