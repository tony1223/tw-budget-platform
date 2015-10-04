import React from "react";
import BaseComponent from './../components/BaseComponent.jsx';


export default class Index extends BaseComponent {
  render(){
    return (
      <div>
        <h1>預算視覺化清單</h1>
        
        <ul>
          {this.props.budgets.map((b)=>
            <li><a href={"/drilldown/"+b.id}>{b.title}</a></li>
          )}
        </ul>
        <div>
        </div>
      </div>
    );
  }
}

