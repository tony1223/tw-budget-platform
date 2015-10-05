
import React from "react";
import unitconverter from "./../helpers/unitconverter.jsx";
// import rd3 from 'react-d3';

import BudgetTable from './../components/BudgetTable.jsx';
import BudgetGroupTable from './../components/BudgetGroupTable.jsx';

import BaseComponent from './../components/BaseComponent.jsx';
import cx from 'classnames';
import CommentHelper from './../helpers/comment.jsx';

import Util from '../helpers/util';

export default class TableView extends BaseComponent {

  constructor(props) {
    super(props);

    if(global.window != null){

      Util.requestJSONs(this.props.budget_links).then((datas)=>{
        var res = datas[0];
        if(res.length && datas.length > 1 && res[0].last_amount == null){
          var map = {};
          datas[1].forEach((data)=>{ map[data.code] = data.amount });

          res.forEach((r) => {
            r.last_amount = parseInt(map[r.code] || 0,10);
            r.change = parseInt(r.amount,10) - parseInt(r.last_amount,10) ;
            r.comment = CommentHelper.refine(r.comment);
          });
        }else{
          res.forEach((r) => {
            r.change = parseInt(r.amount,10) - parseInt(r.last_amount,10) ;
            r.comment = CommentHelper.refine(r.comment);
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
          <div className='col-md-10 '>
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

