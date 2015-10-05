import React from 'react';
import util  from "../helpers/util";
import cx    from "classnames";
var {asset_url} = util;

import BootStrapMenu from "../components/bootStrapMenu.jsx";

export default class FrontLayout extends React.Component {
  render() {
   var GA =  " (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ "+
     "   (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), "+
     "   m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) "+
     "   })(window,document,'script','//www.google-analytics.com/analytics.js','ga'); "+
     "    "+
     "   ga('create', 'UA-67262972-1', 'auto'); "+
     "   ga('send', 'pageview'); "+
     "    "+
     "   ga('create', 'UA-67265163-1', 'auto', {'name': 'newTracker'}); "+
     "   ga('newTracker.send', 'pageview'); ";    

     console.log(this.props);
    var items = [
      { 
        key:"/drilldown/",
        url:"/drilldown/"+this.props.pageInfo.id,
        label:"鳥瞰圖"
      },
      {
        key:"/bubble/",
        url:"/bubble/"+this.props.pageInfo.id,
        label:"變化圖"
      },
      {
        key:"/table/",
        url:"/table/"+this.props.pageInfo.id,
        label:"科目預算表格"
      },
      {
        key:"/",
        url:"/",
        label:"回所有預算視覺化清單"
      }
    ];

 return ( 
    <html>
        <head>
          <meta charset="utf-8" />
        	<title>{this.props.title}</title>

          <meta property="og:type" content="website" />
          <meta property="og:image" content={this.props.pageInfo.ogimage} />

          <meta name="description" content={this.props.pageInfo.description} />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css" />
          <link rel="stylesheet" href={asset_url("css/main.css")} />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body>
          <div className="container">
            <nav className="navbar navbar-default">
              <div className="container-fluid">
                <BootStrapMenu name={this.props.pageInfo.title} items={items} nav={this.props.nav} />
              </div>
            </nav>
            {this.props.children}
            <div className="footer">
              <div className="container" style={{paddingBottom: 20}}>
                <hr />
                <p>Powered by TonyQ , inpsired from <a href="https://github.com/g0v/twbudget">g0v 中央政府總預算系統</a>, welcome to fork or contribute on <a href="https://github.com/tony1223/tw-budget-platform">the Github projects</a>.</p>
              </div>
            </div>
          </div>
          
          <script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
			    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
           <script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/react-with-addons.min.js"></script> 
           <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js"></script> 
          <script src={"/resource/controller/"+this.props.name+".js"} ></script>
          <script dangerouslySetInnerHTML={{__html:GA}}></script>
        </body>
      </html>
    );
  }
}


