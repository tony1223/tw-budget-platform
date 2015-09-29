
import React from "react";
import unitconverter from "./../helpers/unitconverter.jsx";
// import rd3 from 'react-d3';

import BudgetTable from './../components/BudgetTable.jsx';

// import sample from './../helpers/sampledata.jsx';

export default class TableView extends React.Component {

  constructor(props) {
    super(props);

    if(global.window != null && this.props.budget_links.length > 0){
      var datas = [$.get(this.props.budget_links[0])];
      if(this.props.budget_links.length > 1){
        datas.push($.get(this.props.budget_links[1]));
      }
      $.when.apply($,datas).then(([res],[res2]) =>{
        if(typeof res =="string"){
          res = JSON.parse(res);
        }
        if(typeof res2 =="string"){
          res2 = JSON.parse(res2);
        }
        if(res2 != null){
          var map = {};
          res2.forEach((r) =>{
            map[r.code] = parseInt(r.amount,10);
          });
          res.forEach((r) => {
            r.last_amount = map[r.code] || 0;
            r.change = r.last_amount - parseInt(r.amount,10);
            r.comment = this._comment(r.comment);
          });
        }
        this.setState({
          last_budget:res
        });
        this.refs.budget.setState({items:res});
      });
    }

    this.state = {
      budget_links:this.props.budget_links,
      last_budget:this.props.last_budget,
      budgets:this.props.budgets
    };
  }


  _comment(comment){
    if(comment == null){
      return "";
    }
    var html = "<div style='line-height:150%;font-size:16px;'>"+comment+"</div>";
    html = html.replace(/[0-9]+\./gi, (str) => {return "<br /><br />"+str });
    html = html.replace(/\([0-9]+\)/gi, (str) => { return "<br /><br />&nbsp;&nbsp;&nbsp;"+str } );
    html = html.replace(/增列/gi, (str) => { return  "<span style='color:green;'>"+str+"</span>" });
    html = html.replace(/減列/gi, (str) => { return  "<span style='color:red;'>"+str+"</span>"  });
    html = html.replace(/[0-9,]+[ ]?[千]元/gi, this._refine_amount)
    html = html.replace(/上年度預算數/gi, (str) => { return "<b>"+str+"</b>"} );
    return html;
  }

  _refine_amount(str){
    var amount = parseInt(str.replace(/[,千元]/gi,""),10);

    if(str.indexOf("千元") != -1){
      amount = amount * 1000;
    }
    

    if(amount > 1000000){
        return " <b >" + str + 
            ( " (約"+ unitconverter.convert(amount,null,false)+") </b> " )   
    }
    else{
        return " <b >" + str+" </b>" 
    }
  }

  render(){
    var {last_budget} = this.state;
    // var {drilldown} = data;
    return (
      <div>
        <BudgetTable ref='budget' items={last_budget} /> 
      </div>
    );
  }
}


if(global.window != null){
  React.render(React.createElement(TableView,window.react_data), document.getElementById("react-root"));
}

