
import React from "react";
import unitconverter from "./../helpers/unitconverter.jsx";
// import rd3 from 'react-d3';

import BudgetTable from './../components/BudgetTable.jsx';
import BudgetGroupTable from './../components/BudgetGroupTable.jsx';

import BaseComponent from './../components/BaseComponent.jsx';
import cx from 'classnames';


export default class TableView extends BaseComponent {

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
            r.last_amount = parseInt(map[r.code] || 0,10);
            r.change = parseInt(r.amount,10) - parseInt(r.last_amount,10) ;
            r.comment = this._comment(r.comment);
          });
        }
        this.setState({
          last_budget:res,
          waiting:false
        });
      });
    }

    this.state = {
      budget_links:this.props.budget_links,
      last_budget:this.props.last_budget,
      budgets:this.props.budgets,
      waiting:true,
      _subnav:props._subnav
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

  doNav(nav){
    this.setState({_subnav:nav});
    this.setUrl("/table/"+this.props.budget_id+"/"+nav,window.title);
    return false;
  }

  render(){
    var {last_budget} = this.state;
    // var {drilldown} = data;

    var keysMap = {
      topname:{
        topname:{name:"款別"}
      },
      depname:{
        topname:{name:"款別"},
        depname:{name:"項別"}
      },
      category:{
        topname:{name:"款別"},
        depname:{name:"項別"},
        category:{name:"目別"}
      }
    };

    return (
      <div className={cx({"cp-loading":this._waiting})}>
        <ul className="nav nav-tabs">
          <li role="presentation" className={cx({active:this.state._subnav == 'all'})}>
            <a onClick={this.doNav.bind(this,'all')} href={"/table/"+this.props.budget_id+"/all"}>總科目表</a>
          </li>
          <li role="presentation" className={cx({active:this.state._subnav == 'topname'})} >
            <a onClick={this.doNav.bind(this,'topname')} href={"/table/"+this.props.budget_id+"/topname"}>只看款</a>
          </li>
          <li role="presentation" className={cx({active:this.state._subnav == 'depname'})} >
            <a onClick={this.doNav.bind(this,'depname')} href={"/table/"+this.props.budget_id+"/depname"}>只看項</a>
          </li>
          <li role="presentation" className={cx({active:this.state._subnav == 'category'})} >
            <a onClick={this.doNav.bind(this,'category')} href={"/table/"+this.props.budget_id+"/category"}>只看目</a>
          </li>
        </ul>
        {this.state._subnav == 'all' && <div style={{padding:"15px"}} className={cx({row:1})}>
          <br />
          <BudgetTable waiting={this.state.waiting}  items={last_budget} />  
        </div>}
        {
          this.state._subnav != 'all' && <div style={{padding:"15px"}} className={cx({row:1,hidden:this.state._subnav == 'all'})}>
          <div className='col-md-8 '>
            <br />
            <BudgetGroupTable keys={keysMap[this.state._subnav]}  waiting={this.state.waiting} items={last_budget} />
          </div>
        </div>
        }
      </div>
    );
  }
}


if(global.window != null){
  React.render(React.createElement(TableView,window.react_data), document.getElementById("react-root"));
}

