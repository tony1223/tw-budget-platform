
import React from "react";
var ReactDOMServer = require('react-dom/server');

// <DefaultLayout title={this.props.title} name={this.props.name}>
//       </DefaultLayout>


export default class Dispatcher extends React.Component {
  render() {
  	var comp = require("./controller/"+this.props.comp+".jsx");
    var props = this.props.renders;
    if(props == null){
      props = this.props.views;
    }
   //  var skiped = {"settings":1,"comp":1,"setting":1,"cache":1,"_locals":1,"render":1};
  	// for(var k in this.props){
   //    if(skiped[k] === 1){
   //      continue;
   //    }
			// props[k] = this.props[k];
  	// }

    var render = function(comp,props){
      var datas = JSON.stringify(props);
      var childs = ReactDOMServer.renderToString(React.createElement(comp,props)) +
        "<script> window.react_data = "+datas+" </script> ";
      return childs;
    };

  	var DefaultLayout = null;
  	if(this.props.layout == null){
  		DefaultLayout = require('./layouts/default.jsx');
  	}else{
  		DefaultLayout = require('./layouts/'+this.props.layout+'.jsx');
  	}

    var childs = null;
    if(this.props.render){
      childs = this.props.render(comp,props,this.props.views);
    }else{
      childs = render(comp,props,this.props.views);
    }
  	var dev = null;
   //  if(this.props.mode == "develope"){
   //    dev = (<script src={"/webpack-dev-server.js"} ></script>);
   //  }

    return (
      <DefaultLayout scripts={comp.renderServerScripts && comp.renderServerScripts()} pageInfo={this.props.pageInfo} title={this.props.pageInfo.title} name={this.props.comp} nav={this.props.nav}>
      	<div id='react-root' dangerouslySetInnerHTML={{__html:childs}}></div>
        {dev}
        { /* <div dangerouslySetInnerHTML={{__html:this.props.LRScript}}></div> */ }
      </DefaultLayout>
    );
  }
}