import React from 'react';
import util  from "../helpers/util";
import cx    from "classnames";
var {asset_url} = util;

import BootStrapMenu from "../components/bootStrapMenu.jsx";

export default class FrontLayout extends React.Component {
  render() {

    var items = [
      { 
        key:"",
        url:"/",
        label:"預算視覺化首頁"
      },
      { 
        key:"/drilldown/3",
        url:"/drilldown/3",
        label:"鳥瞰圖"
      },
      {
        key:"/bubble/3",
        url:"/bubble/3",
        label:"變化圖"
      },
      {
        key:"/table/3",
        url:"/table/3",
        label:"科目預算表格"
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
                <BootStrapMenu name={this.props.pageInfo.unit} items={items} nav={this.props.nav} />
              </div>
            </nav>
            {this.props.children}
            <div className="footer">
              <div className="container" style={{paddingBottom: 20}}>
                <hr />
                <p>Powered by TonyQ, welcome to fork or contribute on our Github projects
                 </p>
              </div>
            </div>
          </div>
          
          <script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
			    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
         {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/react-with-addons.min.js"></script> */}
          <script src={"/resource/controller/"+this.props.name+".js"} ></script>

        </body>
      </html>
    );
  }
}


