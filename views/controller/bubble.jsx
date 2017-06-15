
import React from "react";
import unitconverter from "./../helpers/unitconverter.jsx";
// import rd3 from 'react-d3';

import D3BudgetBubble from './../components/d3BudgetBubble.jsx';

import CommentHelper from './../helpers/comment.jsx';
import Loading from './../components/Loading.jsx';
import FBComment from './../components/fb/FBComment.jsx';
var ReactDisqusThread = require('react-disqus-thread');

import cx from 'classnames';
import Util from '../helpers/util';
import Promise from "bluebird";

import BaseComponent from './../components/BaseComponent.jsx';
export default class Bubble extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      infoBudget:null,
      selectedBudget:null,
      groupKey:"topname",
      info_state:1      
    };

    if(global.window != null){
      Promise.all([
        Util.getBudgetInfos(this.props.budget_file_type,this.props.budget_links),
        Util.process_gov_type(this.props.budget_meta_links)
      ]).then(([res,gov_types])=>{
        var last_res = res;
        if(gov_types){
          var typeMap = {};
          gov_types.forEach(function(type){
            typeMap[type["代碼"]] = type["名稱"];
          });
          last_res = res.map((r)=>{
            var gov_key = $.trim(r.code).substring(0,2);
            r.gov_type = typeMap[gov_key];
            return r;
          });
        }

        this.setState({
          last_budget:last_res,
          waiting:false
        });
      });
      
    }
  }
  

  componentDidMount() {
    
  }

  componentDidUpdate() {
    
  }


  componentWillUnmount() {
  }

  onBudgetClick(d,cluster){
    this.setState({selectedBudget:d});
    $(document.body).addClass("modal-open");
    // console.log(d,cluster);
  }

  onBudgetOver(d,cluster){
    this.setState({infoBudget:d});
    // console.log(d,cluster);
  }

  onChangeGroupKey(type){
    this.setState({groupKey:type});
  }


  _name(d) {
    return `${d.topname} > ${d.depname} > ${d.category} > ${d.name} `;
  }

  cancelSelect(){
    this.setState({selectedBudget:null});
    $(document.body).removeClass("modal-open");
  }


  toogle_info_state(state){
    this.setState({info_state:this.state.info_state == 1 ? 0 : 1});
  }

  render(){
    // var {data,selectedDrill} = this.state;
    // var {drilldown} = data;
    var {selectedBudget,infoBudget} = this.state;

    var budgetComments = null;
    if(selectedBudget){    
      if(this.props.budget_id == 1){
        budgetComments = <FBComment href={"http://tpebudget.tonyq.org/budget/"+infoBudget.code} />;
      }else if(this.props.budget_id <= 6){
        budgetComments = <FBComment href={"http://budget.tonyq.org/bubble/"+this.props.budget_id+"/"+infoBudget.code} />
      }else{
        budgetComments = <ReactDisqusThread
                shortname="budget-tonyq-org"
                identifier={this.props.budget_id+"/"+infoBudget.code}
                title=""
                url={"http://budget.tonyq.org/bubble/"+this.props.budget_id+"/"+infoBudget.code}
                category_id=""
                onNewComment={this.handleNewComment } />;
      }
    } 

    return (
      <div className='row'>
        <div className='col-xs-12'>
          {this.state.last_budget && 
            <div className='col-xs-12 col-md-12' style={{"margin-bottom":"200px"}}>
              <div class="btn-group" role="group" aria-label="機關政事別切換">
                <button onClick={this.onChangeGroupKey.bind(this,"topname")} type="button" className={cx({"btn":true,"btn-default":true,"btn-primary":this.state.groupKey == "topname"})}>機關別</button>
                {this.state.last_budget && this.state.last_budget[0].gov_type &&
                    (<button onClick={this.onChangeGroupKey.bind(this,"gov_type")} type="button" className={cx({"btn":true,"btn-default":true,"btn-primary":this.state.groupKey == "gov_type"})}>政事別</button>)}
              </div>
              <D3BudgetBubble onBudgetOver={this.onBudgetOver.bind(this)}
                onBudgetClick={this.onBudgetClick.bind(this)} groupKey={this.state.groupKey} items={this.state.last_budget} />
            </div>
          }
          {this.state.last_budget == null && <Loading show={true} />}
        </div>
        {
          infoBudget && 
          <div style={{
              position:'fixed',
              bottom:0,
              left:"5%",
              'width':"90%",
              height:selectedBudget ? "100%":"auto",
              background:"gray",
              color:"white",
              "padding":selectedBudget ? "30px 10px 10px 10px": 
                this.state.info_state == 1 ? "10px" :"10px 0 0 0 ",

              "text-align":"center",
              "font-size":'20px',
              "border-radius":"15px 15px 0 0"
            }}>
            {selectedBudget == null && 
              <p 
                style={{cursor:"pointer",float: "right","right": "27px"}}
                onClick={this.toogle_info_state.bind(this)} 
                className='glyphicon glyphicon-option-horizontal'></p>
            }


            <div>
              {selectedBudget && <div onClick={this.cancelSelect.bind(this)} 
                style={{float:"right","font-size":"34px",cursor:"pointer"}} 
                className='glyphicon glyphicon-remove-circle'>&nbsp;</div>
              }
              <p>{this._name(infoBudget) } </p>
              {(this.state.info_state ==1 ||selectedBudget) && (<div>
                
                <p>科目代碼：{infoBudget.code} </p>
                <p>本年度預算：{unitconverter.convert(infoBudget.amount,null,false)}</p>
                <p>前一年度預算：{unitconverter.convert(infoBudget.last_amount,null,false)}  
                  {infoBudget.change != null && infoBudget.change != 0 && 
                    <span> {unitconverter.percent(infoBudget.change,infoBudget.last_amount)} </span>
                  }
                </p>
                <hr style={{clear:"both"}} />
              </div>)}
               
            </div>

            {selectedBudget &&<div style={{"height":"90%",'text-align':'left',"padding":"0 0 40px 0","overflow":"auto"}} className="">
              
              詳細資料 
              <hr />            
              <div className='row col-md-8 col-md-offset-2'>
                <div dangerouslySetInnerHTML={{__html: infoBudget.comment}} />
                <br />
                <br />
              </div>
              <hr style={{clear:"both"}} /> 
              網友留言 
              <hr />
              <div className='col-md-12'>
                {
                  budgetComments
                }
              </div>
            </div>}
            
          </div>
        }
      </div>
    );
  }
}


if(global.window != null){
  React.render(React.createElement(Bubble,window.react_data), document.getElementById("react-root"));
}

